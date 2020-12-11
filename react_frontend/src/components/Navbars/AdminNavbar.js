import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        user: [],
        Username: "",
        about: "",
        address: "",
        birth_date: "",
        city: "",
        country: "",
        email: "",
        first_name: "",
        last_name: "",
        postal_code: "",
        profession: "",
        telephone: "",
        work_institution: ""
    }
   }

  getData = async () => {
      try {
           const response = await fetch(
              `/home`
          );

          const result = await response.json();

          this.setState(
              prevState => (
                  {
                      Username: result["Username"],
                      email:result["email"],
                      about:result["about"],
                      address:result["address"],
                      birth_date:result["birth_date"],
                      country:result["country"],
                      first_name:result["first_name"],
                      last_name:result["last_name"],
                      postal_code:result["postal_code"],
                      profession:result["profession"],
                      telephone:result["telephone"],
                      work_institution:result["work_institution"],
                  }
              )
          );
      }
    catch(e){
         this.setState(
             prevState => (
                 {
                     error: "No events do Show"
                 }
             )
         );
     }
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.brandText}
            </Link>
            {/*<Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">*/}
            {/*  <FormGroup className="mb-0">*/}
            {/*    <InputGroup className="input-group-alternative">*/}
            {/*      <InputGroupAddon addonType="prepend">*/}
            {/*        <InputGroupText>*/}
            {/*          <i className="fas fa-search" />*/}
            {/*        </InputGroupText>*/}
            {/*      </InputGroupAddon>*/}
            {/*      <Input placeholder="Search" type="text" />*/}
            {/*    </InputGroup>*/}
            {/*  </FormGroup>*/}
            {/*</Form>*/}
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/user.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {this.state.Username}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/edit_profile" tag={Link}>
                    <i className="ni ni-settings-gear-65" />
                    <span>Settings</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem to="/auth/login" tag={Link}>>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;