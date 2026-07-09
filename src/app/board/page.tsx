'use client';

import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  nickname: string;
  content: string;
  createdAt: number;
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete states
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "자유게시판 | 아르고스의 노트";
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/board');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || '의견을 불러오는 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !password.trim() || !content.trim()) {
      setFormError('닉네임, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      const res = await fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          password,
          content
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '의견 등록에 실패했습니다.');
      }

      setNickname('');
      setPassword('');
      setContent('');
      await fetchPosts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!deletePassword.trim()) {
      setDeleteError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setDeleting(true);
      setDeleteError(null);
      const res = await fetch('/api/board', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          password: deletePassword
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '비밀번호가 일치하지 않거나 삭제에 실패했습니다.');
      }

      setDeletePassword('');
      setActiveDeleteId(null);
      await fetchPosts();
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Board Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>자유게시판</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
          경험에 기반한 자유로운 생각과 따뜻한 의견을 남겨주세요.
        </p>
        <hr className="editorial-hr" />
      </div>

      {/* Write Post Section */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '3rem',
        boxShadow: 'var(--card-shadow)'
      }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--brand-navy)', fontFamily: 'var(--font-serif)' }}>의견 남기기</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="nickname" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>닉네임</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                placeholder="닉네임을 입력하세요"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>삭제 비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 설정하세요"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  borderRadius: '4px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>본문 내용</label>
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              placeholder="자유롭게 의견을 적어주세요 (최대 1000자)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-main)',
                borderRadius: '4px',
                outline: 'none',
                resize: 'vertical',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}
            />
          </div>

          {formError && (
            <div style={{ color: 'red', fontSize: '0.85rem', fontWeight: 600 }}>
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              alignSelf: 'flex-end',
              padding: '0.65rem 1.5rem',
              backgroundColor: 'var(--brand-navy)',
              color: 'var(--bg-primary)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              transition: 'background-color var(--transition-smooth), opacity var(--transition-smooth)',
              opacity: submitting ? 0.7 : 1
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = submitting ? '0.7' : '1'; }}
          >
            {submitting ? '등록 중...' : '의견 등록'}
          </button>
        </form>
      </div>

      {/* Post List Section */}
      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--brand-navy)', fontFamily: 'var(--font-serif)' }}>
          최근 남겨진 의견들
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>의견을 불러오는 중입니다...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'red', fontWeight: 600 }}>{error}</div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            아직 등록된 의견이 없습니다. 첫 번째 의견을 남겨보세요!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  boxShadow: 'var(--card-shadow)',
                  position: 'relative'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--brand-navy)' }}>{post.nickname}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>{formatDate(post.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (activeDeleteId === post.id) {
                        setActiveDeleteId(null);
                        setDeletePassword('');
                        setDeleteError(null);
                      } else {
                        setActiveDeleteId(post.id);
                        setDeletePassword('');
                        setDeleteError(null);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-burgundy)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    {activeDeleteId === post.id ? '취소' : '삭제'}
                  </button>
                </div>

                {/* Card Content */}
                <div style={{
                  fontSize: '0.975rem',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-sans)'
                }}>
                  {post.content}
                </div>

                {/* Delete Form Drawer */}
                {activeDeleteId === post.id && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxWidth: '300px'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>삭제 비밀번호 확인</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        style={{
                          flex: 1,
                          padding: '0.35rem 0.5rem',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          borderRadius: '4px',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting}
                        style={{
                          padding: '0.35rem 0.75rem',
                          backgroundColor: 'var(--brand-burgundy)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          opacity: deleting ? 0.7 : 1
                        }}
                      >
                        {deleting ? '삭제 중...' : '확인'}
                      </button>
                    </div>
                    {deleteError && (
                      <span style={{ color: 'red', fontSize: '0.75rem', fontWeight: 600 }}>{deleteError}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
