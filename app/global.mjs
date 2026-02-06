import { _, __, hashCode, setLoadingStage } from "util";
import * as Bugzilla from "bugzilla";
import * as Dialog from "dialog";

const g = {
    appVersion: 1, // bump to force component reloading
    components: undefined,
    account: undefined,
    products: ["Testing"],
    testingComponents: ["AWSY", "mozperftest", "Performance", "Raptor", "Talos"],
};

export function allComponents() {
    return g.components;
}

export function selectedComponents() {
    const result = [];
    for (const $cb of __("#components input:checked")) {
        result.push(g.components.find((c) => c.id.toString() === $cb.id.slice(1)));
    }
    return result;
}

export function getAccount() {
    return g.account;
}

export function setAccount(account) {
    g.account = account;
}

async function loadComponents() {
    // reload components once per month, or if the list of products or appVersion changes
    const now = new Date();
    const productsHash = hashCode(g.products.join("#") + g.appVersion.toString());
    const currentCacheID = `${now.getFullYear()}.${now.getMonth()}:${productsHash}`;
    const cacheID = window.localStorage.getItem("perfdash.componentsID") || "";
    const cacheData = window.localStorage.getItem("perfdash.components");
    if (cacheData && cacheID === currentCacheID) {
        g.components = JSON.parse(cacheData);
        return;
    }

    g.components = [];
    setLoadingStage("Loading Bugzilla products...");

    const productFetches = g.products.map((product) =>
        Bugzilla.rest(`product/${encodeURIComponent(product)}`, {
            // eslint-disable-next-line camelcase
            include_fields:
                "components.id,components.name,components.description,components.team_name",
        })
            .then((response) => ({ product, response }))
            .catch((error) => ({ product, error })),
    );

    try {
        const results = await Promise.all(productFetches);

        for (const result of results) {
            if (result.error) {
                await Dialog.alert(
                    `Failed to load Bugzilla components for ${result.product}: ${result.error}`,
                );
                return;
            }

            if (result.response.products.length === 0) {
                // eslint-disable-next-line no-console
                console.error("Invalid product:", result.product);
                document.body.classList.add("global-error");
                continue;
            }

            for (const component of result.response.products[0].components) {
                if (
                    g.testingComponents &&
                    !g.testingComponents.includes(component.name)
                ) {
                    continue;
                }

                g.components.push({
                    id: component.id,
                    title: `${result.product}: ${component.name}`,
                    desc: component.description
                        .replaceAll(/<[^>]+>/g, " ")
                        .replaceAll("&lt;", "<")
                        .replaceAll("&gt;", ">"),
                    product: result.product,
                    component: component.name,
                    team: component.team_name,
                });
            }
        }
    } catch (error) {
        await Dialog.alert(`Failed to load Bugzilla components: ${error}`);
        return;
    }

    window.localStorage.setItem("perfdash.componentsID", currentCacheID);
    window.localStorage.setItem("perfdash.components", JSON.stringify(g.components));
}

export async function clearComponentsCache() {
    window.localStorage.setItem("perfdash.componentsID", "");
}

export async function loadUser() {
    const apiKey = Bugzilla.getApiKey();
    if (apiKey.length === 0) {
        g.account = undefined;
    } else {
        setLoadingStage("Bugzilla account");
        g.account = await Bugzilla.whoami();
        if (g.account === undefined) {
            await Dialog.alert("Removing invalid Bugzilla API-Key.");
            Bugzilla.setApiKey("");
        }
    }
}

export async function initData() {
    _("#global-error").addEventListener("click", () =>
        document.body.classList.add("egg"),
    );

    await loadUser();
    await loadComponents();
    setLoadingStage("");
}
