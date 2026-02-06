import { _ } from "util";
import * as BugList from "buglist";
import * as Blockers from "buglists/blockers";
import * as Criticals from "buglists/criticals";

export function initUI() {
    const $content = _("#important-content");

    const $group = BugList.newGroup($content);
    Blockers.init($group, true);
    Criticals.init($group, true);
}
