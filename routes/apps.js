const express = require('express');
const router = express.Router();

const controller = require('../controllers/apps_controller');



/**
 * @swagger
 * tags:
 *   name: Apps
 *   description: 버전 업로드 및 업데이트
 *
 */



/** 
 * @swagger
 * /apps/trigger_app_build:
 *   post:
 *     summary: 새로운 빌드가 완성되었을 경우 앱용 서버버전 업데이트
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: insert_apps_version
 *         description: insert_apps_version
 *         schema:
 *           type: object
 *           required:
 *             - build
 *             - snapshot
 *             - url
 *           properties:
 *             build:
 *               type: number
 *             snapshot:
 *               type: string
 *             properties:
 *               type: string
 *  
 *     tags: [Apps]
 *     responses:
 *       200: 
 *       401:
 *       500:
 *
 */
router.post("/trigger_app_build", controller.trigger_app_build);
router.get("/trigger_app_build", controller.trigger_app_build);

router.post("/trigger_app_build_with_apps_idx", controller.trigger_app_build_with_apps_idx);
router.get("/trigger_app_build_with_apps_idx", controller.trigger_app_build_with_apps_idx);





router.post("/login", controller.login);

router.post("/new_app", controller.new_app);
router.post("/update_app", controller.update_app);
router.post("/delete_app", controller.delete_app);
router.post("/get_app", controller.get_app);
router.post("/select_apps", controller.select_apps);
router.post("/find_build_list", controller.find_build_list);




/** 
 * @swagger
 * /apps/insert_app_version/:version:
 *   post:
 *     summary: 새로운 빌드가 완성되었을 경우 앱용 서버버전 업데이트
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: insert_apps_version
 *         description: insert_apps_version
 *         schema:
 *           type: object
 *           required:
 *             - build
 *             - snapshot
 *             - url
 *           properties:
 *             build:
 *               type: number
 *             snapshot:
 *               type: string
 *             properties:
 *               type: string
 *  
 *     tags: [Apps]
 *     responses:
 *       200: 
 *       401:
 *       500:
 *
 */
router.post("/insert_apps_version", controller.insert_apps_version);




/** 
 * @swagger
 * /apps/:app_id/channels/check-device:
 *   post:
 *     summary: 앱에서 버전 업데이틑 위해 버전을 체크하고 결과를 리턴받는것 
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: upload_file
 *         description: upload_file
 *         schema:
 *           type: object
 *           required:
 *             - from_phone
 *             - content
 *             - device
 *           properties:
 *             from_phone:
 *               type: string
 *             content:
 *               type: string
 *             device:
 *               type: string
 *  
 *     tags: [Upload]
 *     responses:
 *       200: 
 *       401:
 *       500:
 *
 */
router.post('/:app_id/channels/check-device', controller.select_current_apps_version);
router.get('/:app_id/channels/check-device', controller.select_current_apps_version);


router.get("/select_app_version_list/:page_no/:count_per_page", controller.select_app_version_list);



router.get("/select_meta_data", controller.select_meta_data);
router.post("/select_meta_data", controller.select_meta_data);




router.post("/update_current_app_version", controller.update_current_app_version);


module.exports = router; 