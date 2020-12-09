/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {Redirect} from "react-router-dom";
import "../../assets/css/custom.css"

// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    Media,
    Table,
    Container,
    Row,
    Button, Col, Progress, DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown, Input,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";
import Maps from "./Maps_Component.js"


class Users_table extends React.Component {

  constructor(props) {
    super(props);

    this.timer = null

    this.toggleDrop1 = this.toggleDrop1.bind(this);
    this.changeValueDrop1 = this.changeValueDrop1.bind(this);
    this.setEditMode=this.setEditMode.bind(this)
    this.NewUser = this.NewUser.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      table_data : [],
      table_data_original : [],
      table_buttons:[],
      curent_page:1,
      num_events:0,
      num_to_show:10,
      dropDown1Value: "Date/Hour",
      dropdownIndex:"between",
      dropDown1Open: false,
      error:false,
      edit_mode:[],
      addUser:false,
      new_email:"",
      new_role:"",
      new_roleType:"",
      new_city:""
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
     this.setState({
      [name]: value
    });

  }

  handleChange2(event,id) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.state.table_data[id][name]=value
    this.setState({
      //table_data[0]=value
    });
  }
   
  handleSubmit(event) {
    event.preventDefault();
    fetch('/add_user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: this.state.new_email,
      role: this.state.new_role,
      role_type: this.state.new_roleType,
      city: this.state.new_city
    }),
    }).then(res => res.json())
      .then(
        (result) => {
          if(result['response']=="Done"){
            this.setState({
                addUser: false,
                new_email:"",
                new_role:"",
                new_roleType:"",
                new_city:""
              }
            )
            this.getData()
          }
            
          else{
            this.setState({ error: result['error'] });

          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: "error"
          });
        }
      )
  }

  handleDelete(mail){
    fetch('/delete_user/' + mail,{method: 'POST'}).then(
      response => response.json()
    ).then(
     result =>{
      this.getData()
     } 
    )

  }

  getData = async () => {
      try {
        const response1 = await fetch(
          `/all_users`
        );

        const result1 = await response1.json();
        if(result1.length===0){
            this.setState(
             prevState => (
                 {
                     error: "No users to Show"
                 }
             )
         );}
        else
              if (this.state.edit_mode.length==0){
                 for (let i = 0; i < result1.length; i++) {
                      this.state.edit_mode.push(false)
                    }
             }
              this.setState(
                  prevState => (
                      {
                          table_data: result1,
                          table_data_original:JSON.parse(JSON.stringify(result1)),
                          error: false
                      }
                  )
              );
      }
    catch(e){
         this.setState(
             prevState => (
                 {
                     error: "No users to Show"
                 }
             )
         );
     }
  }

  renderArray = (value,index) => {
    if (this.state.edit_mode[parseInt(index)]){
        return (
            <tr key={index}>
                <th scope="row" style={{textAlign: "center"}}>
                  <span className="mb-0 text-sm">
                    {value["id"]}
                  </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
                  <span className="mb-0 text-sm">
                    <Input
                      className="form-control-alternative"
                      id="Username"
                      placeholder={value["Username"]}
                      type="text"
                      name="Username"
                      value={value["Username"]}
                      onChange={(e) => this.handleChange2(e,index)}
                    />
                  </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                      className="form-control-alternative"
                      id="email"
                      placeholder={value["email"]}
                      type="text"
                      name="email"
                      value={value["email"]}
                      onChange={(e) => this.handleChange2(e,index)}
                    />
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                      className="form-control-alternative"
                      id="city"
                      placeholder={value["city"]}
                      type="text"
                      name="city"
                      value={value["city"]}
                      onChange={(e) => this.handleChange2(e,index)}
                    />
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                      className="form-control-alternative"
                      id="role"
                      placeholder={value["role"]}
                      type="text"
                      name="role"
                      value={value["role"]}
                      onChange={(e) => this.handleChange2(e,index)}
                    />
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                      className="form-control-alternative"
                      id="input-username"
                      placeholder={value["role_type"]}
                      type="text"
                      name="role_type"
                      value={value["role_type"]}
                      onChange={(e) => this.handleChange2(e,index)}
                    />
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["last_login"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
                    {this.state.edit_mode[index] && (
                        <Button
                            className="icon icon-shape bg-success text-white rounded-circle"
                            type="button"
                            onClick={(e) => this.changeUserInfo(e,index)}
                        >
                            <i className="fas fa-check"></i>
                        </Button>
                    )}
                    {this.state.edit_mode[index] && (
                        <Button
                            className="icon icon-shape bg-warning text-white rounded-circle"
                            type="button"
                            onClick={(e) => this.setEditMode(index, false)}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                    )}
                    {/* delete button */}
                    <Button
                        className="icon icon-shape bg-danger text-white rounded-circle"
                        type="button"
                        onClick={(e) => this.handleDelete(value["email"])}
                    >
                        <i className="fas fa-trash"/>
                    </Button>
                </th>
            </tr>
        )
    }
    else {
        return (

            <tr key={index}>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["id"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["Username"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["email"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["city"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["role"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["role_type"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["last_login"]}
          </span>
                </th>
                <th scope="row" style={{textAlign: "center"}}>
                    {this.state.edit_mode[index] && (
                        <Button
                            className="icon icon-shape bg-success text-white rounded-circle"
                            type="button"
                            onClick={(e) => this.setEditMode(index, false)}
                        >
                            <i className="fas fa-check"></i>
                        </Button>
                    )}
                    {this.state.edit_mode[index] && (
                        <Button
                            className="icon icon-shape bg-warning text-white rounded-circle"
                            type="button"
                            onClick={(e) => this.setEditMode(index, false)}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                    )}
                    <Button
                        className="icon icon-shape bg-yellow text-white rounded-circle"
                        type="button"
                        onClick={(e) => this.setEditMode(index, true)}
                    >
                        <i className="fas fa-pencil-alt"></i>
                    </Button>
                    {/* delete button */}
                    <Button
                        className="icon icon-shape bg-danger text-white rounded-circle"
                        type="button"
                        onClick={(e) => this.handleDelete(value["email"])}
                    >
                        <i className="fas fa-trash"/>
                    </Button>
                </th>
            </tr>
        )
    }
  }

  renderButtons(){
     if(this.state.num_events > this.state.num_to_show){
      const Buttons = []
      if(this.state.curent_page >1)
        Buttons.push(
            <li className="page-item">
                <a className="page-link" onClick={(e)=>this.handleClick(e,this.state.curent_page-1)}>
                    <i className="fas fa-angle-left"/>
                </a>
            </li>
        )
      for (let i = 1; i < Math.ceil(this.state.num_events/this.state.num_to_show)+1; i++) {
        if(i==this.state.curent_page){
          Buttons.push(<li className="page-item active"><a className="page-link" onClick={(e)=>this.handleClick(e,`${i}`)}>{i}</a></li>)
        }
        else{
          Buttons.push(<li className="page-item"><a className="page-link" onClick={(e)=>this.handleClick(e,`${i}`)}>{i}</a></li>)
        }
      }
      if(this.state.curent_page < Math.ceil(this.state.num_events/this.state.num_to_show) )
        Buttons.push(
            <li className="page-item">
                <a className="page-link" onClick={(e)=>this.handleClick(e,parseInt(this.state.curent_page)+1)}>
                    <i className="fas fa-angle-right"/>
                </a>
            </li>
        )

      return(
              <div className="row justify-content-center">
                 <nav aria-label="Page navigation example">
                     <ul className="pagination">
                        {Buttons}
                     </ul>
                 </nav>
              </div>
      )}
      else{
          return
      }
  }

  componentDidMount() {
    this.getData();
    //this.timer = setInterval(() => this.getData(), 10000)
  }

  componentWillUnmount(){
    clearInterval(this.timer)
    this.timer = null
  }

  handleClick = (e,id) => {
    e.preventDefault();
    this.state.curent_page=id
    this.getData();
  };

 /* DropDown functions */
  toggleDrop1() {
    this.setState({dropDown1Open: !this.state.dropDown1Open});
  }

  changeValueDrop1(e,id) {
      const a = ["","between","cars","people","injured","severity","status"]
      this.state.dropDown1Value= e.currentTarget.textContent
      this.state.dropdownIndex= `${a[id]}`
      this.getData(id)
  }
  setEditMode(index,value){
      //console.log(this.state.table_data_original[parseInt(index)])
      if (value==false){
          this.state.table_data[parseInt(index)]=JSON.parse(JSON.stringify(this.state.table_data_original[parseInt(index)]))
      }
      this.state.edit_mode[parseInt(index)]=value
      this.setState(
                  prevState => (
                      {
                      }
                  )
              );
  }

  changeUserInfo(e,index){
   // event.preventDefault();
    this.state.edit_mode[parseInt(index)]=false;
    fetch('/update_user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Username: this.state.table_data[index]["Username"],
      email:this.state.table_data[index]["email"],
      role: this.state.table_data[index]["role"],
      role_type: this.state.table_data[index]["role_type"],
      city: this.state.table_data[index]["city"],
      last_email:this.state.table_data_original[index]["email"]
    }),
    }).then(res => res.json())
       .then(
        (result) => {
          this.getData()

          })
  }


  NewUser(){
      this.setState(
                  prevState => (
                      {
                        addUser:!this.state.addUser
                      }
                  )
              );
  }


  /**************************/

  render() {
      if(this.state.error ){
        return (
         <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}
          <Row className="mt-5">
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent border-0">
                  <Row >
                    <Col>
                      <div className="row ml">
                        <h1 className="mb-0" style={{ paddingLeft: 20}} >Users</h1>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <h1 className="text-danger mb-0" style={{textAlign:"center"}}> {this.state.error}</h1>
                  <br/>
              </Card>
            </div>
          </Row>
        </Container>
      </>);
    }else{
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}
          <Row className="mt-5">
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent border-0">
                  <Row >
                    <Col>
                      <div className="row ml">
                        <h1 className="mb-0" style={{ paddingLeft: 20, paddingRight: 20}} >Users</h1>
                        <Button
                            className="icon icon-shape bg-green text-white rounded-circle"
                            type="button"
                            onClick={(e)=>this.NewUser()}
                        >
                         <i className="fas fa-plus"/>
                       </Button>
                      </div>
                    </Col>
                    <Col >
                      {this.renderButtons()}
                    </Col>
                  </Row>
                </CardHeader>
                <Table bordered
                  className="align-items-center table-flush"
                  hover
                >
                  <thead className="thead-light">
                    <tr >
                      <th scope="col " style={{textAlign:"center"}}>ID</th>
                      <th scope="col"  style={{textAlign:"center"}}>Username</th>
                      <th scope="col" style={{textAlign:"center"}}>Email</th>
                      <th scope="col" style={{textAlign:"center"}}>City</th>
                      <th scope="col" style={{textAlign:"center"}}>Role</th>
                      <th scope="col" style={{textAlign:"center"}}>Role ID</th>
                      <th scope="col" style={{textAlign:"center"}}>Last Login</th>
                      <th scope="col" style={{textAlign:"center"}}   />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.addUser && (
                        <tr  >
                            <th scope = "row" style={{textAlign:"center"}}>
                                {/*id*/}
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                            {/*Username*/}
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                                <Input placeholder="email" type="email" name = "new_email" value = {this.state.new_email}  onChange={this.handleChange} autoComplete="new-password"/>
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                               <Input placeholder="City" type="email" name = "new_city" value = {this.state.new_city}  onChange={this.handleChange} autoComplete="new-password"/>
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                               <Input placeholder="Role" type="email" name = "new_role" value = {this.state.new_role}  onChange={this.handleChange} autoComplete="new-password"/>
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                                <Input placeholder="Role ID" type="email" name = "new_roleType" value = {this.state.new_roleType}  onChange={this.handleChange} autoComplete="new-password"/>
                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>

                            </th>
                            <th scope = "row" style={{textAlign:"center"}}>
                                <Button
                                    className="icon icon-shape bg-warning text-white rounded-circle"
                                    type="button"
                                    onClick={(e) => this.NewUser()}
                                >
                                    <i className="fas fa-times"></i>
                                </Button>

                                <Button
                                    className="icon icon-shape bg-green text-white rounded-circle"
                                    type="button"
                                    onClick={this.handleSubmit}
                                >
                                    <i className="fas fa-arrow-right"></i>
                               </Button>
                            </th>
                          </tr>
                    )}
                    {this.state["table_data"].map(this.renderArray)}
                  </tbody>
                </Table>
                <CardHeader className="bg-transparent border-0">
                  <Row >
                    <Col className="row justify-content-center">
                      {this.renderButtons()}
                    </Col>
                  </Row>
                </CardHeader>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }}
}

export default Users_table;
