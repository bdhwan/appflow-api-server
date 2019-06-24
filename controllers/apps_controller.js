/* 
    controller에서 요청 및 model 처리 후 route로 리턴한다.
*/

//api 로 소스 업로드를 위해서
const shell = require('shelljs');
const apps_model = require('../model/apps_model');
const config = require('../config/config');
const utils = require('../services/utils');
const fs = require('fs');


module.exports = {

    login: async (req, res) => {
        try {
            //디비 인서트
            console.log('login', req.body);
            const { user_id, password } = req.body;
            const result = await apps_model.select_user(user_id, password);
            if (!result) {
                throw 'invalide'
            }

            res.json(
                {
                    status: 1,
                    data: result
                });

        } catch (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
        }
    },

    new_app: async (req, res) => {




        try {
            const result = await apps_model.insert_app(req.body);
            if (!result) {
                throw 'invalide'
            }

            res.json(
                {
                    status: 1,
                    data: result
                });
        } catch (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
        }
    },

    update_app: async (req, res) => {

        const { apps_idx } = req.body;

        try {
            if (!apps_idx) {
                throw 'invalide'
            }
            const result = await apps_model.update_app(req.body);
            if (!result) {
                throw 'invalide'
            }

            res.json(
                {
                    status: 1,
                    data: result
                });
        } catch (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
        }
    },

    delete_app: async (req, res) => {
        const { apps_idx } = req.body;

        try {
            const result = await apps_model.delete_app(apps_idx);
            if (!result) {
                throw 'invalide'
            }

            res.json(
                {
                    status: 1,
                    data: result
                });
        } catch (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
        }
    },

    get_app: async (req, res) => {
        const { apps_idx } = req.body;
        try {
            const result = await apps_model.get_app(apps_idx);
            if (!result) {
                throw 'invalide'
            }

            res.json(
                {
                    status: 1,
                    data: result
                });
        } catch (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
        }
    },


    find_build_list: async (req, res) => {
        const { apps_idx } = req.body;
        try {
            // console.log('select_app_version_list');
            //디비 인서트
            console.log('select_apps_version', req.body);
            const page_no = Number(req.body.page_no);
            const count_per_page = Number(req.body.count_per_page);
            const data = await apps_model.find_build_list(apps_idx, page_no, count_per_page);
            console.log('will return ', data);
            res.json({
                status: 1,
                data: data
            });
        } catch (err) {
            console.error(err);
        }
    },



    select_apps: async (req, res) => {
        try {
            //디비 인서트
            console.log('select_apps', req.body);
            const result = await apps_model.select_apps();
            res.json(
                {
                    status: 1,
                    data: { items: result }
                });
        } catch (err) {
            console.error(err);
        }
    },

    trigger_app_build: async (req, res) => {
        try {
            //디비 인서트
            console.log('trigger_app_build', req.params.apps_idx);
            let apps_idx = req.params.apps_idx;

            console.log('apps_idx =' + apps_idx);


            if (!apps_idx) {
                throw 'no apps idx';
            }
            const build_history_uuid = utils.get_uuid(100);
            const build_history = await apps_model.insert_build_history({
                apps_idx: apps_idx,
                build_history_uuid: build_history_uuid
            });
            const build = build_history.insertId;
            res.json(
                {
                    status: 1,
                    data: {
                        build_history_uuid: build_history_uuid,
                        build: build
                    }
                });
        } catch (err) {
            console.error(err);
        }
    },

    insert_apps_version: async (req, res) => {
        try {
            //디비 인서트
            console.log('insert_apps_version', req.body);
            await apps_model.insert_apps_version(req.body);
            res.json(
                {
                    status: 1,
                    data: true
                });
        } catch (err) {
            console.error(err);
        }
    },


    select_current_apps_version: async (req, res) => {
        try {
            console.log('select_current_apps_version post-' + req.params.app_id);
            //디비 인서트
            console.log('select_apps_version', req.body);
            const result = await apps_model.select_current_apps_version(req.body.app_id, req.body.channel_name);
            if (result) {
                let available = true;
                let platform = 'android';
                if (req.body.device) {
                    const snapshot = req.body.device.snapshot;
                    const build = req.body.device.build;
                    platform = req.body.device.platform;
                    available = !(snapshot === result.snapshot && build === result.build);
                }
                //  "url": 'https://' + utils.get_storage_url() + '/www/' + result.snapshot + '/' + platform + '/pro-manifest.json',
                // "url": result.url + '/' + platform + '/pro-manifest.json',
                const return_data = {
                    "data": {
                        "incompatibleUpdateAvailable": false,
                        "snapshot": result.snapshot,
                        "available": available,
                        "compatible": true,
                        "partial": false,
                        "url": result.url + '/' + platform + '/pro-manifest.json',
                        "build": result.build
                    },
                    "meta": {
                        "status": 200,
                        "request_id": null,
                        "version": "2.0.0-sdlc-beta.0"
                    }
                }
                console.log('will return ', return_data);
                res.json(return_data);
            }
            else {

                const return_data = {
                    "data": {
                        "incompatibleUpdateAvailable": false,
                        "available": false,
                        "compatible": false,
                        "partial": false
                    },
                    "meta": {
                        "status": 200,
                        "request_id": null,
                        "version": "2.0.0-sdlc-beta.0"
                    }
                }
                console.log('will return ', return_data);
                res.json(return_data);
            }

        } catch (err) {
            console.error(err);
        }
    },


    select_app_version_list: async (req, res) => {
        try {
            // console.log('select_app_version_list');
            //디비 인서트
            console.log('select_apps_version', req.body);
            const page_no = Number(req.params.page_no);
            const count_per_page = Number(req.params.count_per_page);
            const data = await apps_model.select_apps_version_list(page_no, count_per_page);
            // console.log('will return ', data);
            res.json({
                status: 1,
                data: data
            });



        } catch (err) {
            console.error(err);
        }
    },

    select_meta_data: async (req, res) => {
        try {
            console.log('select_meta_data');
            const data = {
                storage_path: config.app.storage_path,
                build_server_url: config.app.build_server_url
            };
            // console.log('will return meta -', data)
            res.json({
                status: 1,
                data: data
            });
        } catch (err) {
            console.error(err);
        }
    },

    update_current_app_version: async (req, res) => {
        try {
            //디비 인서트
            console.log('update_current_app_version', req.body);
            await apps_model.update_current_app_version(req.body.apps_idx, req.body.apps_version_idx);

            const url = config.app.build_server_url + '/deploy_web/' + req.body.apps_version_idx;
            console.log('url =' + url);
            utils.getResult(url);

            res.json(
                {
                    status: 1,
                    data: true
                });
        } catch (err) {
            console.error(err);
        }
    },
}





