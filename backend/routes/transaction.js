const express=require("express");
const router=express.Router();
const zod=require("zod");
const {user}=require("../db");
const jwt=require("jsonwebtoken");
const JWT_SEC=require("../config");