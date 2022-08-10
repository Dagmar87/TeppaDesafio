import { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import UserDataService from "../services/user.service";
import IUserData from "../types/user.type";

type Props = {};
type State = {
  users: Array<IUserData>;
  currentUser: IUserData | null;
  currentIndex: number;
  searchNome: string;
};

export default class UsersList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeSearchNome = this.onChangeSearchNome.bind(this);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.removeAllUsers = this.removeAllUsers.bind(this);
    this.searchNome = this.searchNome.bind(this);
    this.state = {
      users: [],
      currentUser: null,
      currentIndex: -1,
      searchNome: "",
    };
  }

  componentDidMount() {
    this.retrieveUsers();
  }

  onChangeSearchNome(e: ChangeEvent<HTMLInputElement>) {
    const searchNome = e.target.value;
    this.setState({
      searchNome: searchNome,
    });
  }

  retrieveUsers() {
    UserDataService.getAll()
      .then((response: any) => {
        this.setState({
          users: response.data,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveUsers();
    this.setState({
      currentUser: null,
      currentIndex: -1,
    });
  }

  setActiveUser(user: IUserData, index: number) {
    this.setState({
      currentUser: user,
      currentIndex: index,
    });
  }

  removeAllUsers() {
    UserDataService.deleteAll()
      .then((response: any) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  searchNome() {
    this.setState({
      currentUser: null,
      currentIndex: -1,
    });
    UserDataService.findByNome(this.state.searchNome)
      .then((response: any) => {
        this.setState({
          users: response.data,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { searchNome, users, currentUser, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por nome"
              value={searchNome}
              onChange={this.onChangeSearchNome}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchNome}
              >
                Pesquisar
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista de Usuários</h4>
          <ul className="list-group">
            {users &&
              users.map((user: IUserData, index: number) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveUser(user, index)}
                  key={index}
                >
                  {user.nome}
                </li>
              ))}
          </ul>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllUsers}
          >
            Excluir tudo
          </button>
        </div>
        <div className="col-md-6">
          {currentUser ? (
            <div>
              <h4>Usuário</h4>
              <div>
                <label>
                  <strong>Nome:</strong>
                </label>{" "}
                {currentUser.nome}
              </div>
              <div>
                <label>
                  <strong>Email:</strong>
                </label>{" "}
                {currentUser.email}
              </div>
              <div>
                <label>
                  <strong>Telefone:</strong>
                </label>{" "}
                {currentUser.telefone}
              </div>
              <Link
                to={"/users/" + currentUser.id}
                className="badge badge-warning"
              >
                Editar
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Por favor, clique em um usuário...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
