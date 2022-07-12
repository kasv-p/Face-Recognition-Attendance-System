<?php
$servername = "localhost";
$username ="root";
$password = "";
$dbname = "rollcall";
$conn = new mysqli($servername, $username, $password, $dbname);
$daysatt=0;
  date_default_timezone_set("Asia/Calcutta");
  $month=date('F');
  $daydate=date("d");
  $intdate=intval($daydate);
  for ($xx=1; $xx <=$intdate ; $xx++)
  {
    if ($xx<10)
    {
      $xx='0'.strval($xx);
    }
    $date=date("Y-m");
    $date=$date.'-'.strval($xx);
    $sql="select students.fname,`$date`as col from students join $month on students.id=$month.id where username='vyshu123'";
    $result=$conn->query($sql);
    $followingdata = $result->fetch_assoc();
    $daysatt+=$followingdata['col'];
  }
$date2='2022'.'-'.date('m').'-'.date('d');
$date1='2022'.'-'.date('m').'-'.'00';
$date1=date_create($date1);
$date2=date_create($date2);
$daystillnow=date_diff($date1,$date2);
$daystillnow=intval($daystillnow->format("%a"));
$perc=($daysatt/$daystillnow)*100;
$perc = number_format($perc, 2);

?>
