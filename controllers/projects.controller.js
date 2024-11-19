const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const Project = require("../models/project.model");


const getAllProjects = async (req, res, next) => {
  let projects;
  try {
    projects = await Project.find().exec();
  } catch (err) {
    const error = new HttpError(
      `Fetching projects failed: ${err.message}`,
      500
    );
    return next(error);
  }

  res.json({
    projects: projects.map((project) => project.toObject({ getters: true })),
  });
};
const getLatestProjects = async (req, res, next) => {
  let latestProjects;
  try {
    latestProjects = await Project.find()
    .sort({createdAt: -1})
    .limit(5)
    .exec()
  } catch (err) {
    const error = new HttpError(
      `Fetching latest projects failed`,
      500
    );
    return next(error);
  }

  res.json({
    latestProjects: latestProjects.map((project) => project.toObject({ getters: true })),
  });
};

const getProjectById = async (req, res, next) => {
  const projectId = req.params.pid;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a project.",
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError(
      "Could not find a project for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ project: project.toObject({ getters: true }) });
};

const createProject = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid inputs passed, please check your data", errors: errors.array() });
  }

  const { title, description } = req.body;
  const createdProject = new Project({
    title,
    description,
    image: req.file.path,  // File path from multer
  });

  try {
    await createdProject.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Project failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ project: createdProject });
};

const updateProjectById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check you data", 422);
  }
  const { title, description } = req.body;
  const projectId = req.params.pid;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }
  project.title = title;
  project.description = description;

  try {
    await project.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update project.",
      500
    );
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
};
const deleteProjectById = async (req, res, next) => {
  const projectId = req.params.pid;
  let project;
  
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete project.",
      500
    );
    return next(error);
  }

  try {
    await project.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete project.",
      500
    );
    return next(error);
  }
  fs.unlink(project.image, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Project Deleted!" });
};

exports.getAllProjects = getAllProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
exports.getLatestProjects = getLatestProjects;
