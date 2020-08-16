var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rT7)tP2&qs",
  database: "worker_trackerDB"
});

connection.connect(function(err) {
  if (err) {
    throw err;
   
  }
displayTasks();
});

function displayTasks() {
    inquirer.prompt({
        type: "list",
        name: "task",
        message: "What would you like to do",
        choices: [
            "add department", 
            "add role",
            "add employee",
            "view departments",
            "view roles",
            "view employees",
            "update employee role",
            "exit"
        ]
    }).then(function(answer){
        switch(answer.task) {
            case "add department":
                 addDepartment();   
                break;
            case "add role":
                addRole();
                break;
            case "add employee":
                addEmployee();
                break;
            case "view departments":
                viewDepartments();
                break;
            case "view roles":
                viewRoles();
                break;
            case "update employee role":
                updateEmployee();
                break;
            case "view employees":
                viewEmployees();
                break;
            case "exit":
                console.log("exit program");
                connection.end();
                break;

        }
    });
}
 function addDepartment() {
     inquirer.prompt({
         type: "input",
         name: "departmentName",
         message: "What's the name of the Department",

     }).then(function(answer){
         var sql = "insert into department set ?";
         connection.query(sql, {
             name: answer.departmentName
         }, function(err){
             if (err) throw err;
             console.log ("department added");
             displayTasks();
         });
     });
 }
 function addRole() {
     var sql = "select id, name from department";
     connection.query(sql, function(err, res){
         if (err) throw err;
         var departments = res.map(({id, name})=>({
             value:id, 
             name: name
         }));
         inquirer.prompt([
             {
                type: "input",
                name: "roleName",
                message: "What's the name of the role"
            },
            {
                type: "input",
                name: "salary",
                message: "What's the salary"
            },
            {
                type: "list",
                name: "departmentID",
                message: "What's the department",
                choices: departments
            }    
         ]).then(function(answer){
            var sql = "insert into role set ?";
            connection.query(sql, {
                title: answer.roleName,
                salary: answer.salary,
                department_id: answer.departmentID
            }, function(err){
                if (err) throw err;
                console.log ("role added");
                displayTasks();
            });
        });
     })
   
}

function viewDepartments () {
    var sql = "select ID, name from department";
    connection.query(sql, function(err, res){
        if (err) throw err;
        console.table(res);
        displayTasks();
    })
}

function viewRoles () {
    var sql = "select * from role JOIN department ON department.ID = role.department_ID";
    connection.query(sql, function(err, res){
        if (err) throw err;
        console.table(res);
        displayTasks();
    })
}

function addEmployee() {
    var sql = "select id, title from role";
    connection.query(sql, function(err, res){
        if (err) throw err;
        var roles = res.map(({id, title})=>({
            value:id, 
            name: title
        }));
        var sql2 = "select id, last_name from employee";
        connection.query(sql2, function(err, res){
            if (err) throw err;
            var employees = res.map(({id, last_name})=>({
                value:id, 
                name: last_name
            }));
            inquirer.prompt([
                {
                type: "input",
                name: "firstName",
                message: "What's the first name of employee"
            },
            {
                type: "input",
                name: "lastName",
                message: "What's the last name of employee"
            },
            {
                type: "list",
                name: "roleID",
                message: "What's the role",
                choices: roles
            },
            {
                type: "list",
                name: "managerID",
                message: "Who's the manager",
                choices: employees
            } 
            ]).then(function(answer){
            var sql = "insert into employee set ?";
            connection.query(sql, {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.roleID,
                manager_id: answer.managerID
            }, function(err){
                if (err) throw err;
                console.log ("employee added");
                displayTasks();
            });
        });
    })
    })
  
}
function viewEmployees () {
    var sql = "select employee.*, role.title, m.last_name from employee JOIN role ON role.id = employee.role_id LEFT JOIN employee m ON m.id = employee.manager_id";
    connection.query(sql, function(err, res){
        if (err) throw err;
        console.table(res);
        displayTasks();
    })
}
  function updateEmployee () {
    var sql = "select * from employee";
    connection.query(sql, function(err, res){
        if (err) throw err;
        var employees = res.map(({id, last_name})=>({
            value:id, 
            name: last_name
        }));
        var sql2 = "select * from role";
        connection.query(sql2, function(err, res){
            if (err) throw err;
            var roles = res.map(({id, title})=>({
                value:id, 
                name: title
            }));   
            inquirer.prompt([
                {
                    type: "list", 
                    name: "employeeID",
                    message: "select employee to update",
                    choices: employees
                    
                },
                {
                    type: "list", 
                    name: "roleID",
                    message: "select employee's new role",
                    choices: roles
                    
                }
            ]).then(function(answer){
                var sql3 = "update employee set role_id = ? where id = ?";
                connection.query(sql3, [answer.roleID, answer.employeeID], function(err, res) {
                    if (err) throw err;
                    console.log("employee updated");
                    displayTasks();
                } )
            });
        });
    })
  }


























