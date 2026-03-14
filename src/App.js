import React, { useState } from 'react';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import { mockAgents, systemStats } from './data';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? mockAgents
    : mockAgents.filter(a => a.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* 背景网格 */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header stats={systemStats} />

        <div style={{ padding: '24px 32px' }}>
          {/* 过滤器 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#333', letterSpacing: 1, marginRight: 8 }}>FILTER:</span>
            {['all', 'running', 'idle', 'error'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? 'rgba(0,255,136,0.15)' : 'transparent',
                border: `1px solid ${filter === f ? '#00ff88' : '#1a1a2e'}`,
                color: filter === f ? '#00ff88' : '#444',
                padding: '4px 14px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'inherit',
                letterSpacing: 1,
                transition: 'all 0.15s',
              }}>
                {f.toUpperCase()}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#333' }}>
              {filtered.length} agent{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Agent 网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}>
            {filtered.map(agent => (
              <AgentCard key={agent.id} agent={agent} onClick={setSelected} />
            ))}
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0d0d1a',
            border: `1px solid ${selected.color}`,
            borderRadius: 12,
            padding: 32,
            width: 480,
            maxWidth: '90vw',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 12,
                background: `linear-gradient(135deg, ${selected.color}22, ${selected.color}44)`,
                border: `1px solid ${selected.color}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
              }}>{selected.emoji}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: selected.color, marginTop: 2 }}>{selected.description}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                marginLeft: 'auto', background: 'transparent',
                border: '1px solid #333', color: '#555',
                width: 28, height: 28, borderRadius: 4,
                cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
              }}>✕</button>
            </div>

            {[
              ['ID', selected.id],
              ['STATUS', selected.status.toUpperCase()],
              ['MODEL', selected.model],
              ['CHANNEL', selected.channel || '—'],
              ['TOTAL RUNS', selected.totalRuns],
              ['SUCCESS RATE', `${selected.successRate}%`],
              ['CURRENT TASK', selected.currentTask || '— idle —'],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #111',
                fontSize: 12,
              }}>
                <span style={{ color: '#444', letterSpacing: 1 }}>{k}</span>
                <span style={{ color: k === 'STATUS'
                  ? (selected.status === 'running' ? '#00ff88' : selected.status === 'error' ? '#ff6b6b' : '#555')
                  : '#ccc', maxWidth: 280, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
