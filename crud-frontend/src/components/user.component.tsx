import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserDataService from "../services/user.service";
import IUserData from "../types/user.type";

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;
type State = {
  currentUser: IUserData;
  message: string;
};

export default class User extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeTelefone = this.onChangeTelefone.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.state = {
      currentUser: {
        id: null,
        nome: "",
        email: "",
        telefone: "",
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getUser(this.props.match.params.id);
  }

  onChangeNome(e: ChangeEvent<HTMLInputElement>) {
    const nome = e.target.value;
    this.setState(function (prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          nome: nome,
        },
      };
    });
  }

  onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    const email = e.target.value;
    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        email: email,
      },
    }));
  }

  onChangeTelefone(e: ChangeEvent<HTMLInputElement>) {
    const telefone = e.target.value;
    this.setState((prevState) => ({
      currentUser: {
        ...prevState.currentUser,
        telefone: telefone,
      },
    }));
  }

  getUser(id: string) {
    UserDataService.get(id)
      .then((response: any) => {
        this.setState({
          currentUser: response.data,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updateUser() {
    UserDataService.update(this.state.currentUser, this.state.currentUser.id)
      .then((response: any) => {
        console.log(response.data);
        this.setState({
          message: "O usuário foi atualizado com sucesso!",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  deleteUser() {
    UserDataService.delete(this.state.currentUser.id)
      .then((response: any) => {
        console.log(response.data);
        this.props.history.push("/users");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        {currentUser ? (
          <div className="edit-form">
            <h4>Usuário</h4>
            <form>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  value={currentUser.nome}
                  onChange={this.onChangeNome}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={currentUser.email}
                  onChange={this.onChangeEmail}
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefone"
                  value={currentUser.telefone}
                  onChange={this.onChangeTelefone}
                />
              </div>              
            </form>            
            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteUser}
            >
              Excluir
            </button>
            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateUser}
            >
              Atualizar
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Por favor, clique em um usuário...</p>
          </div>
        )}
      </div>
    );
  }
}
