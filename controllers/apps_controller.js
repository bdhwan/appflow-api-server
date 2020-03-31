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
        console.log('trigger_bitbucket');
        // console.log('trigger_bitbucket body =', JSON.stringify(req.body));

        const git_full_name = utils.extractFullNameFromPush(req.body);
        const channel_name = utils.extractChannelName(req.body);
        console.log('git_full_name =' + git_full_name);
        console.log('channel_name=' + channel_name);
        const app = await apps_model.find_app(git_full_name, channel_name);
        if (app) {

            console.log('app=' + app.apps_idx);
            let apps_idx = app.apps_idx;

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
        }
        else {
            res.json({
                status: 0
            });
        }

    },

    trigger_app_build_with_apps_idx: async (req, res) => {
        try {
            //디비 인서트
            console.log('trigger_app_build_with_apps_idx', req.params.apps_idx);


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

    insert_app_build: async (req, res) => {
        try {
            //디비 인서트
            console.log('insert_app_build', req.body);
            await apps_model.insert_app_build(req.body);
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
            console.log('select_current_app_build post-' + req.params.app_id);
            //디비 인서트
            console.log('select_current_app_build', req.body);
            const result = await apps_model.select_current_app_build(req.body.app_id, req.body.channel_name);
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


                
                // const return_data = {
                //     "data": {
                //         "partial": false,
                //         "snapshot": "66192f03-8627-492c-b4cf-22775be368dc",
                //         "build": 6743417,
                //         "url": "https://api.ionicjs.com/apps/133e24e9/snapshots/66192f03-8627-492c-b4cf-22775be368dc/manifest",
                //         "compatible": true,
                //         "incompatibleUpdateAvailable": false,
                //         "available": true
                //     },
                //     "meta": {
                //         "status": 200,
                //         "request_id": null,
                //         "version": "2.0.0-sdlc-beta.0"
                //     }
                // }
                

                

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




    select_current_all_app_build: async (req, res) => {
        try {
            const result = await apps_model.select_current_all_app_build();
            res.json(result);
        } catch (err) {
            console.error(err);
        }
    },


    


    select_current_apps_version__: async (req, res) => {
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


                
                // const return_data = {
                //     "data": {
                //         "partial": false,
                //         "snapshot": "66192f03-8627-492c-b4cf-22775be368dc",
                //         "build": 6743417,
                //         "url": "https://api.ionicjs.com/apps/133e24e9/snapshots/66192f03-8627-492c-b4cf-22775be368dc/manifest",
                //         "compatible": true,
                //         "incompatibleUpdateAvailable": false,
                //         "available": true
                //     },
                //     "meta": {
                //         "status": 200,
                //         "request_id": null,
                //         "version": "2.0.0-sdlc-beta.0"
                //     }
                // }
                

                

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






const bitbucketData = {
    "push": {
        "changes": [{
            "forced": false,
            "old": {
                "name": "master",
                "links": {
                    "commits": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commits/master"
                    },
                    "self": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/refs/branches/master"
                    },
                    "html": {
                        "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/branch/master"
                    }
                },
                "default_merge_strategy": "merge_commit",
                "merge_strategies": ["merge_commit", "squash", "fast_forward"],
                "type": "branch",
                "target": {
                    "rendered": {},
                    "hash": "f2fe6f3811148da65ee9a718330d814b7524cde0",
                    "links": {
                        "self": {
                            "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/f2fe6f3811148da65ee9a718330d814b7524cde0"
                        },
                        "html": {
                            "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/f2fe6f3811148da65ee9a718330d814b7524cde0"
                        }
                    },
                    "author": {
                        "raw": "bdhwan <bdhwan@gmail.com>",
                        "type": "author",
                        "user": {
                            "display_name": "배동환",
                            "uuid": "{54b54896-7067-4ccd-a3fe-39fc53619caa}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D/"
                                },
                                "avatar": {
                                    "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7/0bf9ead0-fd5a-45dc-9953-03ac6fc31245/128"
                                }
                            },
                            "nickname": "BAE DONG HWAN",
                            "type": "user",
                            "account_id": "557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7"
                        }
                    },
                    "summary": {
                        "raw": "webhooktest\n",
                        "markup": "markdown",
                        "html": "<p>webhooktest</p>",
                        "type": "rendered"
                    },
                    "parents": [{
                        "hash": "d004300e9c7635b2b76d7623af3c7df035548f66",
                        "type": "commit",
                        "links": {
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/d004300e9c7635b2b76d7623af3c7df035548f66"
                            },
                            "html": {
                                "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/d004300e9c7635b2b76d7623af3c7df035548f66"
                            }
                        }
                    }],
                    "date": "2019-06-25T02:57:42+00:00",
                    "message": "webhooktest\n",
                    "type": "commit",
                    "properties": {}
                }
            },
            "links": {
                "commits": {
                    "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commits?include=0d4b6109669546df1631d6a60c5a9f73326ba4ad&exclude=f2fe6f3811148da65ee9a718330d814b7524cde0"
                },
                "html": {
                    "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/branches/compare/0d4b6109669546df1631d6a60c5a9f73326ba4ad..f2fe6f3811148da65ee9a718330d814b7524cde0"
                },
                "diff": {
                    "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/diff/0d4b6109669546df1631d6a60c5a9f73326ba4ad..f2fe6f3811148da65ee9a718330d814b7524cde0"
                }
            },
            "created": false,
            "commits": [{
                "rendered": {},
                "hash": "0d4b6109669546df1631d6a60c5a9f73326ba4ad",
                "links": {
                    "self": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                    },
                    "comments": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/0d4b6109669546df1631d6a60c5a9f73326ba4ad/comments"
                    },
                    "patch": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/patch/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                    },
                    "html": {
                        "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                    },
                    "diff": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/diff/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                    },
                    "approve": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/0d4b6109669546df1631d6a60c5a9f73326ba4ad/approve"
                    },
                    "statuses": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/0d4b6109669546df1631d6a60c5a9f73326ba4ad/statuses"
                    }
                },
                "author": {
                    "raw": "bdhwan <bdhwan@gmail.com>",
                    "type": "author",
                    "user": {
                        "display_name": "배동환",
                        "uuid": "{54b54896-7067-4ccd-a3fe-39fc53619caa}",
                        "links": {
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/users/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D"
                            },
                            "html": {
                                "href": "https://bitbucket.org/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D/"
                            },
                            "avatar": {
                                "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7/0bf9ead0-fd5a-45dc-9953-03ac6fc31245/128"
                            }
                        },
                        "nickname": "BAE DONG HWAN",
                        "type": "user",
                        "account_id": "557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7"
                    }
                },
                "summary": {
                    "raw": "fix\n",
                    "markup": "markdown",
                    "html": "<p>fix</p>",
                    "type": "rendered"
                },
                "parents": [{
                    "hash": "f2fe6f3811148da65ee9a718330d814b7524cde0",
                    "type": "commit",
                    "links": {
                        "self": {
                            "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/f2fe6f3811148da65ee9a718330d814b7524cde0"
                        },
                        "html": {
                            "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/f2fe6f3811148da65ee9a718330d814b7524cde0"
                        }
                    }
                }],
                "date": "2019-06-25T02:59:20+00:00",
                "message": "fix\n",
                "type": "commit",
                "properties": {}
            }],
            "truncated": false,
            "closed": false,
            "new": {
                "name": "master",
                "links": {
                    "commits": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commits/master"
                    },
                    "self": {
                        "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/refs/branches/master"
                    },
                    "html": {
                        "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/branch/master"
                    }
                },
                "default_merge_strategy": "merge_commit",
                "merge_strategies": ["merge_commit", "squash", "fast_forward"],
                "type": "branch",
                "target": {
                    "rendered": {},
                    "hash": "0d4b6109669546df1631d6a60c5a9f73326ba4ad",
                    "links": {
                        "self": {
                            "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                        },
                        "html": {
                            "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/0d4b6109669546df1631d6a60c5a9f73326ba4ad"
                        }
                    },
                    "author": {
                        "raw": "bdhwan <bdhwan@gmail.com>",
                        "type": "author",
                        "user": {
                            "display_name": "배동환",
                            "uuid": "{54b54896-7067-4ccd-a3fe-39fc53619caa}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D/"
                                },
                                "avatar": {
                                    "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7/0bf9ead0-fd5a-45dc-9953-03ac6fc31245/128"
                                }
                            },
                            "nickname": "BAE DONG HWAN",
                            "type": "user",
                            "account_id": "557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7"
                        }
                    },
                    "summary": {
                        "raw": "fix\n",
                        "markup": "markdown",
                        "html": "<p>fix</p>",
                        "type": "rendered"
                    },
                    "parents": [{
                        "hash": "f2fe6f3811148da65ee9a718330d814b7524cde0",
                        "type": "commit",
                        "links": {
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user/commit/f2fe6f3811148da65ee9a718330d814b7524cde0"
                            },
                            "html": {
                                "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user/commits/f2fe6f3811148da65ee9a718330d814b7524cde0"
                            }
                        }
                    }],
                    "date": "2019-06-25T02:59:20+00:00",
                    "message": "fix\n",
                    "type": "commit",
                    "properties": {}
                }
            }
        }]
    },
    "actor": {
        "display_name": "배동환",
        "uuid": "{54b54896-7067-4ccd-a3fe-39fc53619caa}",
        "links": {
            "self": {
                "href": "https://api.bitbucket.org/2.0/users/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D"
            },
            "html": {
                "href": "https://bitbucket.org/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D/"
            },
            "avatar": {
                "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7/0bf9ead0-fd5a-45dc-9953-03ac6fc31245/128"
            }
        },
        "nickname": "BAE DONG HWAN",
        "type": "user",
        "account_id": "557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7"
    },
    "repository": {
        "scm": "git",
        "website": "",
        "name": "giftistar-ionic4-user",
        "links": {
            "self": {
                "href": "https://api.bitbucket.org/2.0/repositories/bdhwan/giftistar-ionic4-user"
            },
            "html": {
                "href": "https://bitbucket.org/bdhwan/giftistar-ionic4-user"
            },
            "avatar": {
                "href": "https://bytebucket.org/ravatar/%7Bc1f0e36e-4780-48b2-b31b-1ef6836c5bc8%7D?ts=default"
            }
        },
        "full_name": "bdhwan/giftistar-ionic4-user",
        "owner": {
            "display_name": "배동환",
            "uuid": "{54b54896-7067-4ccd-a3fe-39fc53619caa}",
            "links": {
                "self": {
                    "href": "https://api.bitbucket.org/2.0/users/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D"
                },
                "html": {
                    "href": "https://bitbucket.org/%7B54b54896-7067-4ccd-a3fe-39fc53619caa%7D/"
                },
                "avatar": {
                    "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7/0bf9ead0-fd5a-45dc-9953-03ac6fc31245/128"
                }
            },
            "nickname": "BAE DONG HWAN",
            "type": "user",
            "account_id": "557058:5bb5c5a1-eeba-479f-bdd0-ea2c66c789f7"
        },
        "type": "repository",
        "is_private": true,
        "uuid": "{c1f0e36e-4780-48b2-b31b-1ef6836c5bc8}"
    }
}


const githubData = {
    "ref": "refs/heads/master",
    "before": "c4e5e899c8c7f9285d81cb81213a2bc794e098c9",
    "after": "24ec92193e6915601488d1543858edad3f121265",
    "created": false,
    "deleted": false,
    "forced": false,
    "base_ref": null,
    "compare": "https://github.com/bdhwan/appflow-admin/compare/c4e5e899c8c7...24ec92193e69",
    "commits": [{
        "id": "24ec92193e6915601488d1543858edad3f121265",
        "tree_id": "747213452de5d177499c85b587fdaf3720274e0d",
        "distinct": true,
        "message": "Update package.json",
        "timestamp": "2019-06-25T12:29:37+09:00",
        "url": "https://github.com/bdhwan/appflow-admin/commit/24ec92193e6915601488d1543858edad3f121265",
        "author": {
            "name": "Robert Bae",
            "email": "bdhwan@gmail.com",
            "username": "bdhwan"
        },
        "committer": {
            "name": "GitHub",
            "email": "noreply@github.com",
            "username": "web-flow"
        },
        "added": [],
        "removed": [],
        "modified": ["package.json"]
    }],
    "head_commit": {
        "id": "24ec92193e6915601488d1543858edad3f121265",
        "tree_id": "747213452de5d177499c85b587fdaf3720274e0d",
        "distinct": true,
        "message": "Update package.json",
        "timestamp": "2019-06-25T12:29:37+09:00",
        "url": "https://github.com/bdhwan/appflow-admin/commit/24ec92193e6915601488d1543858edad3f121265",
        "author": {
            "name": "Robert Bae",
            "email": "bdhwan@gmail.com",
            "username": "bdhwan"
        },
        "committer": {
            "name": "GitHub",
            "email": "noreply@github.com",
            "username": "web-flow"
        },
        "added": [],
        "removed": [],
        "modified": ["package.json"]
    },
    "repository": {
        "id": 192875060,
        "node_id": "MDEwOlJlcG9zaXRvcnkxOTI4NzUwNjA=",
        "name": "appflow-admin",
        "full_name": "bdhwan/appflow-admin",
        "private": false,
        "owner": {
            "name": "bdhwan",
            "email": "bdhwan@gmail.com",
            "login": "bdhwan",
            "id": 5001286,
            "node_id": "MDQ6VXNlcjUwMDEyODY=",
            "avatar_url": "https://avatars3.githubusercontent.com/u/5001286?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/bdhwan",
            "html_url": "https://github.com/bdhwan",
            "followers_url": "https://api.github.com/users/bdhwan/followers",
            "following_url": "https://api.github.com/users/bdhwan/following{/other_user}",
            "gists_url": "https://api.github.com/users/bdhwan/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/bdhwan/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/bdhwan/subscriptions",
            "organizations_url": "https://api.github.com/users/bdhwan/orgs",
            "repos_url": "https://api.github.com/users/bdhwan/repos",
            "events_url": "https://api.github.com/users/bdhwan/events{/privacy}",
            "received_events_url": "https://api.github.com/users/bdhwan/received_events",
            "type": "User",
            "site_admin": false
        },
        "html_url": "https://github.com/bdhwan/appflow-admin",
        "description": null,
        "fork": false,
        "url": "https://github.com/bdhwan/appflow-admin",
        "forks_url": "https://api.github.com/repos/bdhwan/appflow-admin/forks",
        "keys_url": "https://api.github.com/repos/bdhwan/appflow-admin/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/bdhwan/appflow-admin/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/bdhwan/appflow-admin/teams",
        "hooks_url": "https://api.github.com/repos/bdhwan/appflow-admin/hooks",
        "issue_events_url": "https://api.github.com/repos/bdhwan/appflow-admin/issues/events{/number}",
        "events_url": "https://api.github.com/repos/bdhwan/appflow-admin/events",
        "assignees_url": "https://api.github.com/repos/bdhwan/appflow-admin/assignees{/user}",
        "branches_url": "https://api.github.com/repos/bdhwan/appflow-admin/branches{/branch}",
        "tags_url": "https://api.github.com/repos/bdhwan/appflow-admin/tags",
        "blobs_url": "https://api.github.com/repos/bdhwan/appflow-admin/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/bdhwan/appflow-admin/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/bdhwan/appflow-admin/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/bdhwan/appflow-admin/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/bdhwan/appflow-admin/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/bdhwan/appflow-admin/languages",
        "stargazers_url": "https://api.github.com/repos/bdhwan/appflow-admin/stargazers",
        "contributors_url": "https://api.github.com/repos/bdhwan/appflow-admin/contributors",
        "subscribers_url": "https://api.github.com/repos/bdhwan/appflow-admin/subscribers",
        "subscription_url": "https://api.github.com/repos/bdhwan/appflow-admin/subscription",
        "commits_url": "https://api.github.com/repos/bdhwan/appflow-admin/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/bdhwan/appflow-admin/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/bdhwan/appflow-admin/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/bdhwan/appflow-admin/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/bdhwan/appflow-admin/contents/{+path}",
        "compare_url": "https://api.github.com/repos/bdhwan/appflow-admin/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/bdhwan/appflow-admin/merges",
        "archive_url": "https://api.github.com/repos/bdhwan/appflow-admin/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/bdhwan/appflow-admin/downloads",
        "issues_url": "https://api.github.com/repos/bdhwan/appflow-admin/issues{/number}",
        "pulls_url": "https://api.github.com/repos/bdhwan/appflow-admin/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/bdhwan/appflow-admin/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/bdhwan/appflow-admin/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/bdhwan/appflow-admin/labels{/name}",
        "releases_url": "https://api.github.com/repos/bdhwan/appflow-admin/releases{/id}",
        "deployments_url": "https://api.github.com/repos/bdhwan/appflow-admin/deployments",
        "created_at": 1561017132,
        "updated_at": "2019-06-24T02:09:25Z",
        "pushed_at": 1561433378,
        "git_url": "git://github.com/bdhwan/appflow-admin.git",
        "ssh_url": "git@github.com:bdhwan/appflow-admin.git",
        "clone_url": "https://github.com/bdhwan/appflow-admin.git",
        "svn_url": "https://github.com/bdhwan/appflow-admin",
        "homepage": null,
        "size": 137,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "TypeScript",
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": false,
        "forks_count": 0,
        "mirror_url": null,
        "archived": false,
        "disabled": false,
        "open_issues_count": 0,
        "license": null,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "stargazers": 0,
        "master_branch": "master"
    },
    "pusher": {
        "name": "bdhwan",
        "email": "bdhwan@gmail.com"
    },
    "sender": {
        "login": "bdhwan",
        "id": 5001286,
        "node_id": "MDQ6VXNlcjUwMDEyODY=",
        "avatar_url": "https://avatars3.githubusercontent.com/u/5001286?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bdhwan",
        "html_url": "https://github.com/bdhwan",
        "followers_url": "https://api.github.com/users/bdhwan/followers",
        "following_url": "https://api.github.com/users/bdhwan/following{/other_user}",
        "gists_url": "https://api.github.com/users/bdhwan/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bdhwan/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bdhwan/subscriptions",
        "organizations_url": "https://api.github.com/users/bdhwan/orgs",
        "repos_url": "https://api.github.com/users/bdhwan/repos",
        "events_url": "https://api.github.com/users/bdhwan/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bdhwan/received_events",
        "type": "User",
        "site_admin": false
    }
}

// https://bitbucket.org/bdhwan/giftistar-ionic4-user.git
// console.log('channel =' + data.push.changes[0].new.name);
// console.log('repository =' + data.repository.full_name);

// https://github.com/bdhwan/appflow-admin.git
// console.log(temp.split('@'));

function extractFullName(url) {
    const list = url.replace('http://', '').replace('https://', '').replace('.git', '').split('/');
    console.log(list[list.length - 2] + '/' + list[list.length - 1])
    return list[list.length - 2] + '/' + list[list.length - 1];
}

function extractGitUrl(url) {
    const list = url.split('@');
    let targetUrl = '';
    if (list.length == 1) {
        targetUrl = url.replace('http://', '').replace('https://', '');
    }
    else {
        targetUrl = list[1];
    }
    return targetUrl;
}

function extractChannelName(data) {
    //bitbucket
    if (data.push) {
        return data.push.changes[0].new.name;
    }
    //github
    else {
        const temp = data.ref.split('/');
        return temp[temp.length - 1];
    }
}

function extractFullNameFromPush(data) {
    //bitbucket
    return data.repository.full_name;
}


extractGitUrl('https://github.com/bdhwan/appflow-admin.git');
extractGitUrl('https://bdhwan@bitbucket.org/bdhwan/giftistar-ionic4-user.git');

extractFullName('https://github.com/bdhwan/appflow-admin.git');
extractFullName('https://bdhwan@bitbucket.org/bdhwan/giftistar-ionic4-user.git');
// extractFullName('https://bdhwan@bitbucket.org/bdhwan/giftistar-ionic4-user.git');

console.log('push');
console.log(extractChannelName(bitbucketData));
console.log(extractChannelName(githubData));

console.log(extractFullNameFromPush(bitbucketData));
console.log(extractFullNameFromPush(githubData));

