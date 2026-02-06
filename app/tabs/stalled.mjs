import { _ } from "util";
import * as BugList from "buglist";
import * as AssignedInactive from "buglists/assigned-inactive";
import * as Stalled from "buglists/stalled";

export function initUI() {
    const $content = _("#stalled-content");

    const $group = BugList.newGroup($content);
    Stalled.init($group);
    AssignedInactive.init($group);
}
