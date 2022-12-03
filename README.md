# Transact API - Uma api para transações financeiras

---

## Requisitos

- [x] Deve ser possível criar uma conta.
- [x] Deve ser possível buscar o extrato bancário do cliente.
- [x] Deve ser possível realizar um depósito.
- [x] Deve ser possível realizar um saque.
- [] Deve ser possível buscar o extrato bancário do cliente por data.
- [] Deve ser possível atualizar dados da conta do cliente.
- [] Deve ser possível deletar uma conta.

---

## Regras de Negócio

- [x] Não deve ser possível criar uma conta com CPF já cadastrado.
- [x] Não deve ser possível fazer um depósito em uma conta não existente.
- [x] Não deve ser possível fazer um saque em uma conta não existente.
- [x] Não deve ser possível buscar extrato de uma conta não existente.
- [] Não deve ser possível deletar uma conta não existente.
- [] Não deve ser possível fazer um saque quando o saldo for insuficiente.
