import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    amount: '',
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMining, setIsMining] = useState(false);
  const [visibleHashes, setVisibleHashes] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, pendingRes, blocksRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/transactions/pending`),
        axios.get(`${API_URL}/blocks`),
      ]);
      setTransactions(txRes.data);
      setPendingTransactions(pendingRes.data);
      setBlocks(blocksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data');
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/transaction`, formData);
      setFormData({ sender: '', receiver: '', amount: '' });
      setMessage('Transaction created successfully!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.errors ? 
        Object.values(error.response.data.errors).flat().join(', ') : 
        'Error creating transaction');
    }
  };

  const handleMineBlock = async () => {
    setIsMining(true);
    try {
      await axios.post(`${API_URL}/block/mine`);
      setMessage('Block mined successfully!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error mining block');
    } finally {
      setIsMining(false);
    }
  };

  const handleValidateChain = async () => {
    try {
      const response = await axios.get(`${API_URL}/blockchain/validate`);
      setIsValid(response.data.valid);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error validating blockchain');
    }
  };

  const toggleHashVisibility = (blockId, hashType) => {
    const key = `${blockId}-${hashType}`;
    setVisibleHashes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`${API_URL}/transaction/${transactionId}`);
      setMessage('Transaction deleted successfully!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting transaction');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            ⛓️ Blockchain Explorer
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/10 text-purple-200 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'transactions' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/10 text-purple-200 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            💸 Transactions
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'blocks' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/10 text-purple-200 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            🔗 Blocks
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg backdrop-blur-sm border ${
            isValid === false 
              ? 'bg-red-500/20 border-red-500/50 text-red-200' 
              : 'bg-green-500/20 border-green-500/50 text-green-200'
          }`}>
            {message}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-2xl shadow-blue-500/30 border border-blue-400/20">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="text-xl font-bold mb-2 text-white">Total Blocks</h2>
              <p className="text-5xl font-bold text-blue-100">{blocks.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-8 rounded-2xl shadow-2xl shadow-orange-500/30 border border-orange-400/20">
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-xl font-bold mb-2 text-white">Pending Transactions</h2>
              <p className="text-5xl font-bold text-orange-100">{pendingTransactions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl shadow-purple-500/30 border border-purple-400/20">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-xl font-bold mb-3 text-white">Blockchain Status</h2>
              <button
                onClick={handleValidateChain}
                className="w-full bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all font-semibold border border-white/30"
              >
                Validate Chain
              </button>
              {isValid !== null && (
                <p className={`mt-3 font-bold text-lg ${isValid ? 'text-green-300' : 'text-red-300'}`}>
                  {isValid ? '✅ Chain Valid' : '❌ Chain Invalid'}
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
              <span>💸</span> Create New Transaction
            </h2>
            <form onSubmit={handleCreateTransaction} className="space-y-5">
              <div>
                <label className="block mb-2 text-purple-200 font-semibold">Sender Name</label>
                <input
                  type="text"
                  value={formData.sender}
                  onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 p-4 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                  placeholder="Enter sender name..."
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-purple-200 font-semibold">Receiver Name</label>
                <input
                  type="text"
                  value={formData.receiver}
                  onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 p-4 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                  placeholder="Enter receiver name..."
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-purple-200 font-semibold">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white/10 border border-purple-500/30 p-4 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                  placeholder="Enter amount..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-bold text-lg"
              >
                ✨ Create Transaction
              </button>
            </form>

            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>⏳</span> Pending Transactions
                </h3>
                <button
                  onClick={handleMineBlock}
                  disabled={pendingTransactions.length === 0 || isMining}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    pendingTransactions.length === 0 || isMining
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50'
                  }`}
                >
                  {isMining ? '⚙️ Mining... (~5-10 sec)' : '⛏️ Mine Block'}
                </button>
              </div>
              <div className="space-y-3">
                {pendingTransactions.map((tx) => (
                  <div key={tx.id} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 p-5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-center gap-4">
                      <div className="grid grid-cols-3 gap-4 text-purple-200 flex-1">
                        <div>
                          <p className="text-purple-400 text-sm mb-1">From</p>
                          <p className="font-mono text-sm">{tx.sender}</p>
                        </div>
                        <div>
                          <p className="text-purple-400 text-sm mb-1">To</p>
                          <p className="font-mono text-sm">{tx.receiver}</p>
                        </div>
                        <div>
                          <p className="text-purple-400 text-sm mb-1">Amount</p>
                          <p className="font-bold text-green-400 text-lg">₱{tx.amount}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 font-semibold"
                        title="Delete pending transaction"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
                {pendingTransactions.length === 0 && (
                  <div className="text-center py-12 text-purple-300">
                    <p className="text-6xl mb-4">📭</p>
                    <p>No pending transactions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-6">
              <span>🔗</span> Blockchain Explorer
            </h2>
            {blocks.map((block, idx) => (
              <div key={block.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">#{block.index_no}</span>
                      <h3 className="text-2xl font-bold text-white">Block {block.index_no}</h3>
                    </div>
                    <p className="text-purple-300">
                      ⏰ {new Date(block.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                    <p className="text-purple-300 text-sm">Nonce</p>
                    <p className="text-white font-bold text-xl">{block.nonce}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-blue-300 font-semibold">🔗 Previous Hash</p>
                      <button
                        onClick={() => toggleHashVisibility(block.id, 'prev')}
                        className="text-blue-300 hover:text-blue-200 transition-colors p-1"
                        title={visibleHashes[`${block.id}-prev`] ? "Hide hash" : "Show hash"}
                      >
                        {visibleHashes[`${block.id}-prev`] ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-blue-200 break-all bg-blue-500/10 p-2 rounded">
                      {visibleHashes[`${block.id}-prev`] 
                        ? (block.previous_hash || '0000000000000000 (Genesis Block)')
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-green-300 font-semibold">🔐 Current Hash</p>
                      <button
                        onClick={() => toggleHashVisibility(block.id, 'current')}
                        className="text-green-300 hover:text-green-200 transition-colors p-1"
                        title={visibleHashes[`${block.id}-current`] ? "Hide hash" : "Show hash"}
                      >
                        {visibleHashes[`${block.id}-current`] ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-green-200 break-all bg-green-500/10 p-2 rounded">
                      {visibleHashes[`${block.id}-current`] 
                        ? block.current_hash
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 p-5 rounded-lg border border-purple-500/20">
                  <p className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                    <span>💸</span> Transactions ({block.transactions?.length || 0})
                  </p>
                  <div className="space-y-2">
                    {block.transactions?.map((tx) => (
                      <div key={tx.id} className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200 font-mono">{tx.sender}</span>
                          <span className="text-purple-400">→</span>
                          <span className="text-purple-200 font-mono">{tx.receiver}</span>
                          <span className="text-green-400 font-bold">₱{tx.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {blocks.length === 0 && (
              <div className="text-center py-20 text-purple-300">
                <p className="text-8xl mb-6">⛓️</p>
                <p className="text-2xl">No blocks in the blockchain yet</p>
                <p className="mt-2">Create some transactions and mine your first block!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
