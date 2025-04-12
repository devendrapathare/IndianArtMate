import React, { useState } from 'react';
import './WalletPage.css';
import HistoryComp from '../../components-p2/WalletPageComp/HistoryComp/HistoryComp';
import Wallet from '../../../person-3/Components-3/wallet/Wallet';
import PassbookComp from '../../components-p2/WalletPageComp/PassbookComp/PassbookComp';
import AnalyticsComp from '../../components-p2/WalletPageComp/AnalyticsComp/AnalyticsComp';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('recharge');

  const renderComponent = () => {
    switch (activeTab) {
      case 'history':
        return <HistoryComp />;
      case 'recharge':
        return <Wallet />;
      case 'passbook':
        return <PassbookComp />;
      case 'analytics':
        return <AnalyticsComp />;
      default:
        return null;
    }
  };

  return (
    <div className="wallet-page">
      <div className="wallet-container">
        <div className="wallet-tabs">
          <button
            className={activeTab === 'recharge' ? 'active' : ''}
            onClick={() => setActiveTab('recharge')}
          >
            Wallet
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={activeTab === 'passbook' ? 'active' : ''}
            onClick={() => setActiveTab('passbook')}
          >
            Passbook
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
        <div className="wallet-content">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;