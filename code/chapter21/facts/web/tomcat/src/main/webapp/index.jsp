<%@page isELIgnored="false" %>
<%@page pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
      <c:forEach items="${facts}" var="fact">
        <tr>
          <td><b>${fact.key}</b></td>
          <td>${fact.value}</td>
        </tr>
      </c:forEach>
      </tbody>
    </table>
  </div>
  </body>
</html>
