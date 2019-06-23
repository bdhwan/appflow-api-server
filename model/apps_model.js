/* 
    DB관련 작업은 무조건 여기서 다한다.
    필요시 파일을 쪼개고, api.js에서 import하면 된다.
*/
const pool = require('../services/mysql.js');
const utils = require('../services/utils.js');


module.exports = {

    select_user: async (user_id, password) => {
        return await utils.queryOne(pool, 'select * from system where user_id=? and password=? limit 1', [user_id, password]);
    },

    insert_build_history: async (data) => {
        return await utils.query(pool, 'INSERT INTO build_history SET ?', [data]);
    },

    update_build_history: async (build_history_idx, success, build_duration, log, status) => {
        return await utils.query(pool, 'UPDATE build_history SET success = ?, build_duration = ?, log = ?, status=? where build_history_idx = ? limit 1', [success, build_duration, log, status, build_history_idx]);
    },

    insert_app: async (data) => {
        return await utils.query(pool, 'INSERT INTO apps SET ?', [data]);
    },

    update_app: async (data) => {
        return await utils.query(pool, 'UPDATE apps set app_id=?,channel_name=?,git_url=?,git_user_pw=?,git_user_id=?,endpoint=?,cache_url=?,auto_update=?,android_link=?, ios_link=? where apps_idx=? limit 1', [data.app_id, data.channel_name, data.git_url, data.git_user_pw, data.git_user_id, data.endpoint, data.cache_url, data.auto_update, data.android_link, data.ios_link, data.apps_idx]);
    },


    delete_app: async (apps_idx) => {
        await utils.query(pool, 'DELETE FROM apps where apps_idx=? limit 1', [apps_idx]);
        await utils.query(pool, 'DELETE FROM apps_version where apps_idx=? limit 1', [apps_idx]);
        await utils.query(pool, 'DELETE FROM build_history where apps_idx=? limit 1', [apps_idx]);
        return true;
    },

    get_app: async (apps_idx) => {
        return await utils.queryOne(pool, 'select * FROM apps where apps_idx=? limit 1', [apps_idx]);
    },

    select_apps: async () => {
        return await utils.queryList(pool, 'select * FROM apps order by apps_idx desc', []);
    },


    find_build_list: async (apps_idx, page_no, count_per_page) => {
        let total_item_count;
        let total_page_count;
        let items;
        const connection = await pool.getConnection();
        try {
            // await utils.beginTransaction(connection);
            items = await utils.queryListTransaction(connection, 'SELECT SQL_CALC_FOUND_ROWS b.*, a.apps_version_idx, a.build, a.snapshot, a.url, a.enabled FROM build_history b left join apps_version a on b.build_history_idx = a.build where b.apps_idx = ? order by b.build_history_idx desc limit ?,?', [apps_idx, page_no * count_per_page, count_per_page]);
            const temp = await utils.queryOneTransaction(connection, "SELECT FOUND_ROWS() as count", []);
            console.log('temp =', temp);
            total_item_count = temp.count;
            total_page_count = Math.ceil(total_item_count / count_per_page);
        } catch (error) {
            console.error(error);
        }
        connection.release();

        return {
            page_no: page_no,
            total_item_count: total_item_count,
            total_page_count: total_page_count,
            items: items
        }
    },


    insert_apps_version: async (data) => {
        return await utils.query(pool, 'INSERT INTO apps_version SET ?', [data]);
    },

    select_current_apps_version: async () => {
        return await utils.queryOne(pool, 'SELECT * from apps_version WHERE enabled = true order by apps_version_idx desc limit 1', []);
    },

    get_ready_build: async () => {
        return await utils.queryOne(pool, 'select * from build_history where status = ? order by build_history_idx asc limit 1', ['ready']);
    },

    update_build: async (build_history_idx, status) => {
        return await utils.queryOne(pool, 'update build_history set status=? where build_history_idx = ? limit 1', [status, build_history_idx]);
    },

    clear_building: async () => {
        return await utils.queryOne(pool, 'update build_history set status=? where status = ? ', ['ready', 'building']);
    },

    update_current_app_version: async (apps_idx, apps_version_idx) => {
        await utils.query(pool, 'UPDATE apps_version SET enabled=false where apps_idx = ?', [apps_idx]);
        await utils.query(pool, 'UPDATE apps_version SET enabled=true where apps_version_idx =?', [apps_version_idx]);
    },


    select_apps_version_list: async (page_no, count_per_page) => {
        let total_item_count;
        let total_page_count;
        let items;
        const connection = await pool.getConnection();
        try {
            // await utils.beginTransaction(connection);
            items = await utils.queryListTransaction(connection, 'SELECT SQL_CALC_FOUND_ROWS b.*, a.apps_version_idx, a.build, a.snapshot, a.url, a.enabled FROM build_history b left join apps_version a on b.build_history_idx = a.build order by b.build_history_idx desc limit ?,?', [page_no * count_per_page, count_per_page]);
            const temp = await utils.queryOneTransaction(connection, "SELECT FOUND_ROWS() as count", []);
            console.log('temp =', temp);
            total_item_count = temp.count;
            total_page_count = Math.ceil(total_item_count / count_per_page);
        } catch (error) {
            console.error(error);
        }
        connection.release();

        return {
            page_no: page_no,
            total_item_count: total_item_count,
            total_page_count: total_page_count,
            items: items
        }
    },
}
