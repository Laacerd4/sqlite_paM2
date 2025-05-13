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
        VALUES ('Isabelly'),
               ('Pedro'),
               ('Diana');
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
      {[
        { title: "Criar BD", onPress: abrirBanco },
        { title: "Criar Tabela", onPress: CriarTabela },
        { title: "Inserir", onPress: Inserir },
        { title: "Exibir", onPress: Exibir },
        { title: "Excluir Tabela", onPress: DropTabela },
        { title: "Deletar ID 1", onPress: () => DeletarUsuario(1) },
        { title: "Alterar ID 2 p/ Jouão", onPress: () => AlterarUsuario(2, 'Jouão') }
      ].map((btn, index) => (
        <View key={index} style={styles.buttonWrapper}>
          <Button title={btn.title} onPress={btn.onPress} color="#fc32d1" />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertical
    alignItems: 'center',     // horizontal
    backgroundColor: '#fff',
    padding: 20,
  },
  buttonWrapper: {
    width: 200,
    marginVertical: 6,
  },
});

export default Banco;
