<?php require "./session.php" ?>

<!DOCTYPE html>
<html lang="ru">

<head>
  <title>putty</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
  <link rel="stylesheet" href="style.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <script src="script_data.js"></script>
  <script src="script.js"></script>
</head>

<body>
  <div class="container mt-2">
    <h2 class="container">Команды терминала putty для сервера политеха</h2>
  </div>
  <div class="container mt-2 mb-4">
    <?php
    require "./block_inputs.php";
    require "./block_select.php";
    require "./block_getcode.php";
    ?>
  </div>
</body>

</html>