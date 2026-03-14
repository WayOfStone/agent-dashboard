import React, { useState, useEffect } from 'react';

export default function Header({ stats }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      borderBottom: '1px solid #1a1a2e',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: 'linear-gradient(135deg, #00ff8833, #00d4ff33)',
          border: '1px solid #00ff8866',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>⚡</div>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: '#00ff88',
            letterSpacing: 2,
            animation: 'glitch 8s infinite',
          }}>AGENT CONTROL CENTER</div>
          <div style={{ fontSize: 10, color: '#333', letterSpacing: 1 }}>OPENCLAW · NEO</div>
        </div>
      </div>

      {/* 系统状态 */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <StatBadge value={stats.runningAgents} label="RUNNING" color="#00ff88" />
        <StatBadge value={stats.idleAgents} label="IDLE" color="#555" />
        <StatBadge value={stats.errorAgents} label="ERROR" color="#ff6b6b" />
        <div style={{ width: 1, height: 24, background: '#1a1a2e' }} />
        <StatBadge value={stats.totalTasksToday} label="TASKS TODAY" color="#00d4ff" />
        <StatBadge value={stats.uptime} label="UPTIME" color="#ffd700" />
      </div>

      {/* 时钟 */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#00ff88', letterSpacing: 2 }}>
          {time.toLocaleTimeString('zh-CN', { hour12: false })}
        </div>
        <div style={{ fontSize: 10, color: '#333' }}>
          {time.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })} · CST
        </div>
      </div>
    </div>
  );
}

function StatBadge({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 9, color: '#333', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}
