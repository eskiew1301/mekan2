const express = require("express");
const { check } = require("express-validator");
const checkAuth=require('../middleware/check-auth')
const projectsController = require("../controllers/projects.controller");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/", projectsController.getAllProjects);
router.get("/latest-projects", projectsController.getLatestProjects);
router.get("/:pid", projectsController.getProjectById);
router.use(checkAuth)
router.post(
  "/new",
  fileUpload.single("image"),
  
  projectsController.createProject
);
router.patch(
  "/:pid",
  [
    check("title").not().isEmpty().withMessage("Title is required"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long"),
    check("image").optional().isString(),
  ],
  projectsController.updateProjectById
);
router.delete("/:pid", projectsController.deleteProjectById);

module.exports = router;
