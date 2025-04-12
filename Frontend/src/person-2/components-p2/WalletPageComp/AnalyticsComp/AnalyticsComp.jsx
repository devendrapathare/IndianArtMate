import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './AnalyticsComp.css';

const AnalyticsComp = () => {
  const [chartData, setChartData] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/wallet/history', {
          withCredentials: true,
        });

        const historyData = res.data.data.filter(
          (item) => item.paymentStatus === 'success'
        );

        let filtered = [];

        if (filterType === 'customDate' && startDate && endDate) {
          filtered = historyData.filter((item) => {
            const created = new Date(item.createdAt);
            return created >= new Date(startDate) && created <= new Date(endDate);
          });
        } else if (filterType === 'customMonth' && selectedMonth) {
          filtered = historyData.filter((item) => {
            const created = new Date(item.createdAt);
            const monthStr = `${created.getFullYear()}-${String(
              created.getMonth() + 1
            ).padStart(2, '0')}`;
            return monthStr === selectedMonth;
          });
        } else {
          filtered = historyData;
        }

        const formatted = filtered
          .map((item) => ({
            date: new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
            }),
            amount: item.amount,
          }))
          .reverse();

        const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);

        setChartData(formatted);
        setTotalAmount(total);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };

    fetchHistory();
  }, [filterType, startDate, endDate, selectedMonth]);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Wallet Recharge Analytics</h2>
        <div className="filter-controls">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="customDate">Custom Date</option>
            <option value="customMonth">Custom Month</option>
          </select>

          {filterType === 'customDate' && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}

          {filterType === 'customMonth' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          )}
        </div>
      </div>

      <h3>Total Amount: ₹{totalAmount}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b49df"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsComp;
