import Log from "@novemberizing/log";

import assert from "assert";

import Storage from "../src/Storage.js";
import StroageExtensionConfig from "../src/storage/extension/Config.js";

const name = "Storage";

Log.config = {
    error: false,
    warning: false,
    information: false,
    debug: false,
    verbose: false
};

describe(name, () => {
    it(` 0001 new Storage()`, () => {
        assert.throws(() => {
            const o = new Storage();
        });
    });

    it(` 0002 new Storage({})`, () => {
        assert.throws(() => {
            const o = new Storage({});
        });
    });

    it(` 0003 new Storage({ url: null })`, () => {
        assert.throws(() => {
            const o = new Storage({
                url: null
            });
        });
    });

    async function noextensionCheck(o) {
        assert.strictEqual(await o.query("del"), undefined);
        assert.strictEqual(await o.query("get"), undefined);
        assert.strictEqual(await o.query("set", "helloworld"), "helloworld");
        assert.strictEqual(await o.query("get"), "helloworld");
        assert.strictEqual(await o.query("set", undefined), undefined);
        assert.strictEqual(await o.query("get"), undefined);
        assert.strictEqual(await o.query("set", null), null);
        assert.strictEqual(await o.query("get"), null);
        assert.strictEqual(await o.query("del"), undefined);
    }

    it(` 0004 new Storage({ url: "mem://./configure" })`, async () => {
        const o = new Storage({
            url: "mem://./configure"
        });
        await noextensionCheck(o);

        assert.deepStrictEqual(await o.query("set", {}), {});
        assert.deepStrictEqual(await o.query("get"), {});

        assert.deepStrictEqual(await o.query("set", { hello: "world" }), { hello: "world" });
        assert.deepStrictEqual(await o.query("get"), { hello: "world" });

        assert.strictEqual(await o.query("del"), undefined);
        assert.strictEqual(await o.query("get"), undefined);
    });

    it(` 0005 new Storage({ url: "fs://./configure" })`, async () => {
        const o = new Storage({
            url: "fs://./configure"
        });
        await noextensionCheck(o);

        await assert.rejects(o.query("set", {}));

        assert.strictEqual(await o.query("del"), undefined);
        assert.strictEqual(await o.query("get"), undefined);
    });

    
    it(` 0006 new Storage({ url: "mysql://root@localhost/unknowndb" })`, async () => {
        assert.throws(() => {
            const o = new Storage({
                url: "mysql://root@localhost/unknowndb"
            });
        });
    });

    it(` 0007 new Storage({ url: "mysql://root@localhost/unknowndb", adapter: { password: "melong@17" } })`, async () => {
        const o = new Storage({
            url: "mysql://root@localhost/unknowndb",
            adapter: {
                password: "melong@17"
            }
        });

        await assert.rejects(async () => {
            await o.query("SELECT 1");
        });
    });

    it(` 0008 new Storage({ url: "mysql://root@localhost/world", adapter: { password: "melong@17" } })`, async () => {
        const o = new Storage({
            url: "mysql://root@localhost/world",
            adapter: {
                password: "melong@17"
            }
        });

        // assert.deepStrictEqual(await o.query("SELECT * FROM city WHERE ID=?", 1), {
        //     ID: 1,
        //     Name: 'Kabul',
        //     CountryCode: 'AFG',
        //     District: 'Kabol',
        //     Population: 1780000
        // });

        // assert.deepStrictEqual(await o.query("SELECT * FROM city WHERE ID=? OR ID=?", 1, 2), [
        //     {
        //         ID: 1,
        //         Name: 'Kabul',
        //         CountryCode: 'AFG',
        //         District: 'Kabol',
        //         Population: 1780000
        //     },
        //     {
        //         ID: 2,
        //         Name: 'Qandahar',
        //         CountryCode: 'AFG',
        //         District: 'Qandahar',
        //         Population: 237500
        //     }
        // ]);

        await o.close();
    });

    async function JsonExtensionCheck(o) {
        assert.strictEqual(await o.query("del", ""), undefined);
        
        await assert.rejects(o.query("get"));
        await assert.rejects(o.query("get", null));
        await assert.rejects(o.query("get", undefined));
        await assert.rejects(o.query("get", [{}]));

        assert.strictEqual(await o.query("get", 0), undefined);
        assert.deepStrictEqual(await o.query("set", "", []), []);
        assert.strictEqual(await o.query("get", 0), undefined);
        assert.deepStrictEqual(await o.query("set", "", ["hello", "world"]), ["hello", "world"]);
        assert.strictEqual(await o.query("get", 0), "hello");
        assert.strictEqual(await o.query("get", 1), "world");
        assert.strictEqual(await o.query("get", 3), undefined);
        await assert.rejects(o.query("set", "hello.world", "helloworld"));
        assert.strictEqual(await o.query("set", "", "helloworld"), "helloworld");
        await assert.rejects(o.query("set", "hello.world", "helloworld"));
        assert.deepStrictEqual(await o.query("set", "", { hello2: { world2: "1" } }), { hello2: { world2: "1" } });
        assert.deepStrictEqual(await o.query("set", "hello.world", "helloworld"), "helloworld");
        assert.deepStrictEqual(await o.query("get", ""), { hello2: { world2: '1' }, hello: { world: 'helloworld' } });
        assert.deepStrictEqual(await o.query("get", "hello2"), { world2: '1' });
        assert.deepStrictEqual(await o.query("get", "hello2.world2"), "1");
        assert.deepStrictEqual(await o.query("get", "hello"), { world: 'helloworld' });
        assert.deepStrictEqual(await o.query("get", "hello.world"), 'helloworld');
        assert.deepStrictEqual(await o.query("get", "hello.world.none"), undefined);
        assert.deepStrictEqual(await o.query("get", "hello.world.none.none"), undefined);
        assert.strictEqual(await o.query("get", 0), undefined);
        assert.strictEqual(await o.query("del", ""), undefined);
    }

    it(` 0009 new Storage({ url: "mem://./configure.json" })`, async () => {
        const o = new Storage({
            url: "mem://./configure.json"
        });

        await JsonExtensionCheck(o);
    });

    it(` 0010 new Storage({ url: "fs://./configure.json" })`, async () => {
        const o = new Storage({
            url: "fs://./configure.json"
        });

        await JsonExtensionCheck(o);
    });

    it(` 0011 new Storage({ url: "mysql://root@localhost/novemberizing", adapter: { password: "melong@17" } })`, async () => {
        const o = new Storage({
            url: "mysql://root@localhost/novemberizing",
            adapter: {
                password: "melong@17"
            },
            extension: {
                install: {
                    sql: []
                }
            }
        });

        // console.log(await o.query("install"));

        // await o.query("INSERT INTO TE_MANAGER (`text`) VALUES ('hello')");

        await o.close();
    });
});

