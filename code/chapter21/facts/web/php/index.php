<?php
function hex2str($hex) {
  $str = '';
  for($i=0;$i<strlen($hex);$i+=2) {
    $str .= chr(hexdec(substr($hex,$i,2)));
  }
  return $str;
}

  $source = $_REQUEST['source'];
  $stmt = $_REQUEST['stmt'];
  if (empty($source) or empty($stmt)) {
    // Not valid entry
  } else {
    $transaction_req = 'localhost:46657/broadcast_tx_commit?tx="' 
        . urlencode($source) . ':' 
        . urlencode($stmt) . '"';
    $ch = curl_init($transaction_req);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_exec($ch);
    curl_close($ch);
  }

  $query_req = 'localhost:46657/abci_query?data="all"';
  $ch = curl_init($query_req);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $json_str = curl_exec($ch);
  $json = json_decode($json_str, true);
  $result = hex2str($json['result']['response']['value']);
  curl_close($ch);

  $entries = explode(",", $result);

  // print_r ($json);
  // print_r ($entries);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
    <h1>Facts!</h1>
    <form>
      <div class="form-group">
        <label for="source">Source</label>
        <input type="text" class="form-control" name="source" id="source">
      </div>
      <div class="form-group">
        <label for="stmt">Statement</label>
        <input type="text" class="form-control" name="stmt" id="stmt">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <p>&nbsp;</p>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Source</th>
          <th># of statements</th>
        </tr>
      </thead>
      <tbody>
<?php
    foreach ($entries as $entry) {
      list($s, $c) = explode(":", $entry);
?>
        <tr>
          <td><b><?= $s ?></b></td>
          <td><?= $c ?></td>
        </tr>
<?php
    }
?>
      </tbody>
    </table>
  </div>
  </body>
</html>
