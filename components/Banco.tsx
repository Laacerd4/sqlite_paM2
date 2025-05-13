import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;

const Banco = () => {
  async function abrirBanco() {
    db = await SQLite.openDatabaseAsync('PAM2');
    if (db) {
      console.log("Banco aberto (ou criado)");
      return db;
    } else {
      console.log("Erro ao abrir o banco");
    }
  }

  async function CriarTabela() {
    db = await abrirBanco();
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS TB_USUARIO (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         nome TEXT NOT NULL);`
      );
      console.log("tabela criada");
    } catch (erro) {
      console.log("Erro");
    }
  }

  async function Inserir() {
    db = await abrirBanco();
    try {
      db.execAsync(`
        INSERT INTO TB_USUARIO (nome)
        VALUES ('Ricardo'),
               ('Zé Matraca'),
               ('Maria ');
      `);
      console.log('Inserido');
    } catch (erro) {
      console.log('Erro' + erro);
    }
  }

  async function Exibir() {
    db = await abrirBanco();
    const allRows = await db.getAllAsync('SELECT * FROM tb_usuario');
    for (const row of allRows) {
      console.log(row.id, row.nome);
    }
  }

  async function DropTabela() {
    db = await abrirBanco();
    try {
      await db.execAsync(`DROP TABLE IF EXISTS TB_USUARIO;`);
      console.log("Tabela TB_USUARIO excluída");
    } catch (erro) {
      console.log("Erro ao dropar tabela:", erro);
    }
  }

  async function DeletarUsuario(id) {
    db = await abrirBanco();
    try {
      await db.runAsync(`DELETE FROM TB_USUARIO WHERE id = ?`, [id]);
      console.log(`Usuário com ID ${id} deletado`);
    } catch (erro) {
      console.log("Erro ao deletar usuário:", erro);
    }
  }

  async function AlterarUsuario(id, novoNome) {
    db = await abrirBanco();
    try {
      await db.runAsync(
        `UPDATE TB_USUARIO SET nome = ? WHERE id = ?`,
        [novoNome, id]
      );
      console.log(`Usuário com ID ${id} alterado para "${novoNome}"`);
    } catch (erro) {
      console.log("Erro ao alterar usuário:", erro);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Criar BD" onPress={abrirBanco} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Criar Tabela" onPress={CriarTabela} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Inserir" onPress={Inserir} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Exibir" onPress={Exibir} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Excluir Tabela" onPress={DropTabela} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Deletar ID 1" onPress={() => DeletarUsuario(1)} color="#fc32d1" />
      <View style={styles.spacer} />
      <Button title="Alterar ID 2 p/ João" onPress={() => AlterarUsuario(2, 'João')} color="#fc32d1" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // centraliza verticalmente
    alignItems: 'center',     // centraliza horizontalmente
    backgroundColor: '#fff',
    padding: 20,
  },
  spacer: {
    marginVertical: 5,
  },
});

export default Banco;
