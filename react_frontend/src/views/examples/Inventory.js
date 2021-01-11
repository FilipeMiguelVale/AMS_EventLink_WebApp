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
import "../../assets/css/custom.css"

// reactstrap components
import {Button, Card, CardHeader, Col, Container, Input, Row, Table,} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";


class Inventory extends React.Component {

    constructor(props) {
        super(props);

        this.timer = null

        this.toggleDrop1 = this.toggleDrop1.bind(this);
        this.changeValueDrop1 = this.changeValueDrop1.bind(this);
        this.setEditMode = this.setEditMode.bind(this)
        this.NewUser = this.NewUser.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            table_data: [],
            table_data_original: [],
            table_buttons: [],
            curent_page: 1,
            num_events: 0,
            num_to_show: 10,
            dropDown1Value: "Date/Hour",
            dropdownIndex: "between",
            dropDown1Open: false,
            error: false,
            edit_mode: [],
            addUser: false,
            new_name: "",
            new_in_house: "",
            new_out_house: "",
            new_price_each: ""
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

    handleChange2(event, id) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.state.table_data[id][name] = value
        this.setState({
            //table_data[0]=value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('/add_material', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.new_name,
                in_house: this.state.new_in_house,
                out_house: this.state.new_out_house,
                price_each: this.state.new_price_each,
            }),
        }).then(res => res.json())
            .then(
                (result) => {
                    if (result['response'] == "Done") {
                        this.setState({
                                addUser: false,
                                new_name: "",
                                new_in_house: "",
                                new_out_house: "",
                                new_price_each: ""
                            }
                        )
                        this.getData()
                    } else {
                        this.setState({error: result['error']});

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

    handleDelete(mail) {
        fetch('/delete_material/' + mail, {method: 'POST'}).then(
            response => response.json()
        ).then(
            result => {
                this.getData()
            }
        )

    }

    getData = async () => {
        try {
            const response1 = await fetch(
                `/all_inventory`
            );

            const result1 = await response1.json();
            if (result1.length === 0) {
                this.setState(
                    prevState => (
                        {
                            error: "No Inventory to Show"
                        }
                    )
                );
            } else if (this.state.edit_mode.length == 0) {
                for (let i = 0; i < result1.length; i++) {
                    this.state.edit_mode.push(false)
                }
            }
            this.setState(
                prevState => (
                    {
                        table_data: result1,
                        table_data_original: JSON.parse(JSON.stringify(result1)),
                        error: false
                    }
                )
            );
        } catch (e) {
            this.setState(
                prevState => (
                    {
                        error: "No Inventory to Show"
                    }
                )
            );
        }
    }

    renderArray = (value, index) => {
        if (this.state.edit_mode[parseInt(index)]) {
            return (
                <tr key={index}>
                    <th scope="row" style={{textAlign: "center"}}>
                  <span className="mb-0 text-sm">
                    {parseInt(value["in_house"]) + parseInt(value["out_house"])}
                  </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
                  <span className="mb-0 text-sm">
                    <Input
                        className="form-control-alternative"
                        id="Username"
                        placeholder={value["name"]}
                        type="text"
                        name="Username"
                        value={value["Username"]}
                        onChange={(e) => this.handleChange2(e, index)}
                    />
                  </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                  className="form-control-alternative"
                  id="in_house"
                  placeholder={value["in_house"]}
                  type="text"
                  name="in_house"
                  value={value["in_house"]}
                  onChange={(e) => this.handleChange2(e, index)}
              />
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                  className="form-control-alternative"
                  id="out_house"
                  placeholder={value["out_house"]}
                  type="text"
                  name="out_house"
                  value={value["out_house"]}
                  onChange={(e) => this.handleChange2(e, index)}
              />
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
              <Input
                  className="form-control-alternative"
                  id="price_each"
                  placeholder={value["price_each"]}
                  type="text"
                  name="price_each"
                  value={value["price_each"]}
                  onChange={(e) => this.handleChange2(e, index)}
              />
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {parseInt(value["price_each"]) * parseInt(value["in_house"]) + parseInt(value["out_house"])}€
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["last_mod"]}
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
                        {this.state.edit_mode[index] && (
                            <Button
                                className="icon icon-shape bg-success text-white rounded-circle"
                                type="button"
                                onClick={(e) => this.changeUserInfo(e, index)}
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
                            onClick={(e) => this.handleDelete(index)}
                        >
                            <i className="fas fa-trash"/>
                        </Button>
                    </th>
                </tr>
            )
        } else {
            return (

                <tr key={index}>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["in_house"] + value["out_house"]}
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["name"]}
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["in_house"]}
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["out_house"]}
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["price_each"]}€
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["price_each"] * (value["in_house"] + value["out_house"])}€
          </span>
                    </th>
                    <th scope="row" style={{textAlign: "center"}}>
          <span className="mb-0 text-sm">
            {value["last_mod"]}
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
                            onClick={(e) => this.handleDelete(index)}
                        >
                            <i className="fas fa-trash"/>
                        </Button>
                    </th>
                </tr>
            )
        }
    }

    renderButtons() {
        if (this.state.num_events > this.state.num_to_show) {
            const Buttons = []
            if (this.state.curent_page > 1)
                Buttons.push(
                    <li className="page-item">
                        <a className="page-link" onClick={(e) => this.handleClick(e, this.state.curent_page - 1)}>
                            <i className="fas fa-angle-left"/>
                        </a>
                    </li>
                )
            for (let i = 1; i < Math.ceil(this.state.num_events / this.state.num_to_show) + 1; i++) {
                if (i == this.state.curent_page) {
                    Buttons.push(<li className="page-item active"><a className="page-link"
                                                                     onClick={(e) => this.handleClick(e, `${i}`)}>{i}</a>
                    </li>)
                } else {
                    Buttons.push(<li className="page-item"><a className="page-link"
                                                              onClick={(e) => this.handleClick(e, `${i}`)}>{i}</a></li>)
                }
            }
            if (this.state.curent_page < Math.ceil(this.state.num_events / this.state.num_to_show))
                Buttons.push(
                    <li className="page-item">
                        <a className="page-link"
                           onClick={(e) => this.handleClick(e, parseInt(this.state.curent_page) + 1)}>
                            <i className="fas fa-angle-right"/>
                        </a>
                    </li>
                )

            return (
                <div className="row justify-content-center">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {Buttons}
                        </ul>
                    </nav>
                </div>
            )
        } else {
            return
        }
    }

    componentDidMount() {
        this.getData();
        //this.timer = setInterval(() => this.getData(), 10000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        this.timer = null
    }

    handleClick = (e, id) => {
        e.preventDefault();
        this.state.curent_page = id
        this.getData();
    };

    /* DropDown functions */
    toggleDrop1() {
        this.setState({dropDown1Open: !this.state.dropDown1Open});
    }

    changeValueDrop1(e, id) {
        const a = ["", "between", "cars", "people", "injured", "severity", "status"]
        this.state.dropDown1Value = e.currentTarget.textContent
        this.state.dropdownIndex = `${a[id]}`
        this.getData(id)
    }

    setEditMode(index, value) {
        //console.log(this.state.table_data_original[parseInt(index)])
        if (value == false) {
            this.state.table_data[parseInt(index)] = JSON.parse(JSON.stringify(this.state.table_data_original[parseInt(index)]))
        }
        this.state.edit_mode[parseInt(index)] = value
        this.setState(
            prevState => (
                {}
            )
        );
    }

    changeUserInfo(e, index) {
        // event.preventDefault();
        this.state.edit_mode[parseInt(index)] = false;
        fetch('/update_material/' + index, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.table_data[index]["name"],
                in_house: this.state.table_data[index]["in_house"],
                out_house: this.state.table_data[index]["out_house"],
                price_each: this.state.table_data[index]["price_each"],
            }),
        }).then(res => res.json())
            .then(
                (result) => {
                    this.getData()

                })
    }


    NewUser() {
        this.setState(
            prevState => (
                {
                    addUser: !this.state.addUser
                }
            )
        );
    }


    /**************************/

    render() {
        if (this.state.error) {
            return (
                <>
                    <Header/>
                    {/* Page content */}
                    <Container className="mt--7" fluid>
                        {/* Dark table */}
                        <Row className="mt-5">
                            <div className="col">
                                <Card className="shadow">
                                    <CardHeader className="bg-transparent border-0">
                                        <Row>
                                            <Col>
                                                <div className="row ml">
                                                    <h1 className="mb-0" style={{paddingLeft: 20}}>Inventory</h1>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <h1 className="text-danger mb-0"
                                        style={{textAlign: "center"}}> {this.state.error}</h1>
                                    <br/>
                                </Card>
                            </div>
                        </Row>
                    </Container>
                </>);
        } else {
            return (
                <>
                    <Header/>
                    {/* Page content */}
                    <Container className="mt--7" fluid>
                        {/* Dark table */}
                        <Row className="mt-5">
                            <div className="col">
                                <Card className="shadow">
                                    <CardHeader className="bg-transparent border-0">
                                        <Row>
                                            <Col>
                                                <div className="row ml">
                                                    <h1 className="mb-0"
                                                        style={{paddingLeft: 20, paddingRight: 20}}>Inventory</h1>
                                                    <Button
                                                        className="icon icon-shape bg-green text-white rounded-circle"
                                                        type="button"
                                                        onClick={(e) => this.NewUser()}
                                                    >
                                                        <i className="fas fa-plus"/>
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col>
                                                {this.renderButtons()}
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <Table bordered
                                           className="align-items-center table-flush"
                                           hover
                                    >
                                        <thead className="thead-light">
                                        <tr>
                                            <th scope="col " style={{textAlign: "center"}}>Quantity</th>
                                            <th scope="col" style={{textAlign: "center"}}>Name</th>
                                            <th scope="col" style={{textAlign: "center"}}>In House</th>
                                            <th scope="col" style={{textAlign: "center"}}>Out House</th>
                                            <th scope="col" style={{textAlign: "center"}}>Price Each</th>
                                            <th scope="col" style={{textAlign: "center"}}>Total Price</th>
                                            <th scope="col" style={{textAlign: "center"}}>Last Modified</th>
                                            <th scope="col" style={{textAlign: "center"}}/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.addUser && (
                                            <tr>
                                                <th scope="row" style={{textAlign: "center"}}>
                                                    {/*id*/}
                                                </th>
                                                <th scope="row" style={{textAlign: "center"}}>
                                                    <Input placeholder="name" type="email" name="new_name"
                                                           value={this.state.new_email} onChange={this.handleChange}
                                                           autoComplete="new-password"/>
                                                </th>
                                                <th scope="row" style={{textAlign: "center"}}>
                                                    <Input placeholder="0" type="email" name="new_in_house"
                                                           value={this.state.new_email} onChange={this.handleChange}
                                                           autoComplete="new-password"/>
                                                </th>
                                                <th scope="row" style={{textAlign: "center"}}>
                                                    <Input placeholder="0" type="email" name="new_out_house"
                                                           value={this.state.new_city} onChange={this.handleChange}
                                                           autoComplete="new-password"/>
                                                </th>
                                                <th scope="row" style={{textAlign: "center"}}>
                                                    <Input placeholder="0" type="email" name="new_price_each"
                                                           value={this.state.new_roleType} onChange={this.handleChange}
                                                           autoComplete="new-password"/>
                                                </th>
                                                <th scope="row" style={{textAlign: "center"}}></th>
                                                <th scope="row" style={{textAlign: "center"}}></th>
                                                <th scope="row" style={{textAlign: "center"}}>
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
                                        <Row>
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
        }
    }
}

export default Inventory;
