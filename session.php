<?php
session_start();
if ($_POST["task"] == "set") {
    $_SESSION["data"] = isset($_POST["data"]) ? $_POST["data"] : "";
    exit();
} else if ($_POST["task"] == "get") {
    echo isset($_SESSION["data"])
        ? $_SESSION["data"]
        : "";
    exit();
};
