import React, { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  running: { label: 'RUNNING', color: '#00ff88', bg: 'rgba(0,255,136,0.1)' },
  idle:    { label: 'IDLE',    color: '#888',    bg: 'rgba(136,136,136,0.08)' },
  error:   { label: 'ERROR',   color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
};

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatRelative(date) {
  if (!date) return '—';
  const diff = Date.now() - date.getTime();
  if (diff < 0) return `in ${formatDuration(-diff)}`;
  return `${formatDuration(diff)} ago`;
}

function formatNext(date) {
  if (!date) return '—';
  const diff = date.getTime() - Date.now();
  if (diff < 0) return 'overdue';
  return `in ${formatDuration(diff)}`;
}

export default function AgentCard({ agent, onClick }) {
  const [runtime, setRuntime] = useState(0);
  const cfg = STATUS_CONFIG[agent.status];

  useEffect(() => {
    if (agent.status !== 'running' || !agent.startedAt) return;
    const tick = () => setRuntime(Date.now() - agent.startedAt.getTime());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [agent.status, agent.startedAt]);

  return (
    <div onClick={() => onClick(agent)} style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${agent.status === 'running' ? agent.color : '#1a1a2e'}`,
      borderRadius: 8,
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeIn 0.4s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.border = `1px solid ${agent.color}`;
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.border = `1px solid ${agent.status === 'running' ? agent.color : '#1a1a2e'}`;
      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
    }}>

      {/* 顶部光条 */}
      {agent.status === 'running' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
          animation: 'pulse 2s infinite',
        }} />
      )}

      {/* 头部：头像 + 名字 + 状态 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 8,
          background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}44)`,
          border: `1px solid ${agent.color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {agent.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{agent.name}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 1,
              color: cfg.color, background: cfg.bg,
              padding: '2px 7px', borderRadius: 3,
              border: `1px solid ${cfg.color}44`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: cfg.color,
                display: 'inline-block',
                animation: agent.status === 'running' ? 'pulse 1.2s infinite' : 'none',
              }} />
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{agent.description}</div>
        </div>
      </div>

      {/* 当前任务 */}
      <div style={{
        background: 'rgba(0,0,0,0.3)', borderRadius: 5,
        padding: '8px 12px', marginBottom: 12,
        borderLeft: `2px solid ${agent.status === 'running' ? agent.color : '#333'}`,
        minHeight: 36,
      }}>
        {agent.currentTask ? (
          <div style={{ fontSize: 12, color: agent.status === 'running' ? '#ccc' : '#555' }}>
            {agent.status === 'running' && (
              <span style={{ color: agent.color, marginRight: 6 }}>▶</span>
            )}
            {agent.currentTask}
            {agent.status === 'running' && (
              <span style={{ color: '#555', marginLeft: 8 }}>
                [{formatDuration(runtime)}]
              </span>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#333' }}>— no active task —</div>
        )}
      </div>

      {/* 统计行 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Stat label="MODEL" value={agent.model.split('/').pop().replace('claude-','').replace('-4-','4.')} color={agent.color} />
        <Stat label="SUCCESS" value={`${agent.successRate}%`} color={agent.successRate > 95 ? '#00ff88' : agent.successRate > 80 ? '#ffd700' : '#ff6b6b'} />
        <Stat label="RUNS" value={agent.totalRuns} color="#888" />
      </div>

      {/* 时间信息 */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444' }}>
        <span>last: {agent.lastRun ? formatRelative(agent.lastRun) : '—'}</span>
        {agent.nextRun && <span style={{ color: '#555' }}>next: {formatNext(agent.nextRun)}</span>}
        {agent.channel && <span>ch: {agent.channel}</span>}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '6px 4px' }}>
      <div style={{ fontSize: 9, color: '#444', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
