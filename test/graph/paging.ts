import { expect } from "chai";
import "@pnp/graph/groups";
import "@pnp/graph/users";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import getTestingGraphSPSite from "./utilities/getTestingGraphSPSite.js";
import { getRandomString } from "@pnp/core";
import { graphPost, GraphCollection, IGraphCollection } from "@pnp/graph";
import { body } from "@pnp/queryable";

describe("Groups", function () {

    let itemsCol: IGraphCollection;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
            return;
        }

        const site = await getTestingGraphSPSite(this);

        const listInfo = await site.lists.add({
            displayName: `Test_${getRandomString(4)}`,
            list: { "template": "genericList" },
        });

        itemsCol = GraphCollection(site.lists.getById(listInfo.data.id), "items");

        for (let i = 0; i < 11; i++) {
            await graphPost(itemsCol, body({
                Title: `Test_${getRandomString(4)}`,
            }));
        }
    });

    it("pages all users", async function () {

        const count = await this.pnp.graph.users.count();

        const allUsers = [];

        for await (const users of this.pnp.graph.users.top(20).select("displayName")) {
            allUsers.push(...users);
        }

        expect(allUsers.length).to.eq(count);
    });

    it("pages groups", async function () {

        const count = await this.pnp.graph.groups.count();

        expect(count).is.gt(0);

        const allGroups = [];

        for await (const groups of this.pnp.graph.groups.top(20).select("displayName")) {
            allGroups.push(...groups);
        }

        expect(allGroups.length).to.eq(count);
    });

    it("groups count", async function () {

        const count = await this.pnp.graph.groups.count();

        expect(count).to.be.gt(0);
    });

    it("pages items", async function () {

        const allItems = [];

        for await (const items of itemsCol) {
            allItems.push(...items);
        }

        expect(allItems.length).to.be.gt(0);
    });

    it("items count", async function () {

        const count = await itemsCol.count();

        // items doesn't support count, should be zero
        expect(count).to.eq(-1);
    });
});
