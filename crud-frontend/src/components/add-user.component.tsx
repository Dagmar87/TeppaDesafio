import { Component, ChangeEvent } from "react";
import UserDataService from "../services/user.service";
import IUserData from "../types/user.type";

type Props = {};
type State = IUserData & {
  submitted: boolean;
};

export default class AddUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeTelefone = this.onChangeTelefone.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.newUser = this.newUser.bind(this);
    this.state = {
      id: null,
      nome: "",
      email: "",
      telefone: "",
      submitted: false,
    };
  }

  onChangeNome(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      nome: e.target.value,
    });
  }

  onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangeTelefone(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      telefone: e.target.value,
    });
  }

  saveUser() {
    const data: IUserData = {
      nome: this.state.nome,
      email: this.state.email,
      telefone: this.state.telefone,
    };
    UserDataService.create(data)
      .then((response: any) => {
        this.setState({
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          telefone: response.data.telefone,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  newUser() {
    this.setState({
      id: null,
      nome: "",
      email: "",
      telefone: "",
      submitted: false,
    });
  }

  render() {
    const { submitted, nome, email, telefone } = this.state;
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Você enviou com sucesso!</h4>
            <button className="btn btn-success" onClick={this.newUser}>
              Adicionar
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                required
                value={nome}
                onChange={this.onChangeNome}
                name="nome"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                required
                value={email}
                onChange={this.onChangeEmail}
                name="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="telefone"
                required
                value={telefone}
                onChange={this.onChangeTelefone}
                name="telefone"
              />
            </div>
            <button onClick={this.saveUser} className="btn btn-success">
              Enviar
            </button>
          </div>
        )}
      </div>
    );
  }
}
