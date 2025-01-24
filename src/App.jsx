import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlwWujXd2meAdCHBK9fxR7Ru7_zdj4GJ8",
  authDomain: "bolt-e4d42.firebaseapp.com",
  projectId: "bolt-e4d42",
  storageBucket: "bolt-e4d42.firebasestorage.app",
  messagingSenderId: "607228134861",
  appId: "1:607228134861:web:5570c824a4d7455442b084"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');
  const [cartaoCredito, setCartaoCredito] = useState('');
  const [data, setData] = useState('');
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    const despesasCollection = collection(db, 'despesas');
    const unsubscribe = onSnapshot(despesasCollection, (snapshot) => {
      const despesasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDespesas(despesasData);
    });

    return () => unsubscribe();
  }, []);

  const adicionarDespesa = async (e) => {
    e.preventDefault();
    if (!descricao || !valor || !data) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    try {
      const despesasCollection = collection(db, 'despesas');
      await addDoc(despesasCollection, {
        descricao,
        valor: parseFloat(valor),
        categoria,
        cartaoCredito,
        data: new Date(data)
      });
      setDescricao('');
      setValor('');
      setCartaoCredito('');
      setData('');
    } catch (error) {
      console.error("Erro ao adicionar despesa: ", error);
      alert('Erro ao adicionar despesa.');
    }
  };

  const removerDespesa = async (id) => {
    try {
      const despesaDoc = doc(db, 'despesas', id);
      await deleteDoc(despesaDoc);
    } catch (error) {
      console.error("Erro ao remover despesa: ", error);
      alert('Erro ao remover despesa.');
    }
  };

  return (
    <div className="container">
      <h1>Controle de Despesas Pessoais</h1>
      <form onSubmit={adicionarDespesa}>
        <div className="form-group">
          <label>Descrição:</label>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Valor:</label>
          <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
         <div className="form-group">
          <label>Cartão de Crédito:</label>
          <input type="text" value={cartaoCredito} onChange={(e) => setCartaoCredito(e.target.value)} />
        </div>
         <div className="form-group">
          <label>Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <button type="submit">Adicionar Despesa</button>
      </form>
      <div className="expense-list">
        {despesas.map(despesa => (
          <div key={despesa.id} className="expense-item">
            <span>{despesa.descricao}</span>
            <span>R$ {despesa.valor.toFixed(2)}</span>
            <span>{despesa.categoria}</span>
             <span>{despesa.cartaoCredito}</span>
             <span>{despesa.data ? new Date(despesa.data.seconds * 1000).toLocaleDateString() : ''}</span>
            <button onClick={() => removerDespesa(despesa.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
