import { useEffect, useRef, useState } from 'react'
import './App.css'

const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/25139270-02ee-4599-8df1-a9741930cf1a'
const imgGroup1 = `${assetPathPrefix}/3bd89.svg`
const imgGroup2 = `${assetPathPrefix}/ab65f.svg`
const imgFrame6 = 'https://www.figma.com/api/mcp/asset/5f212275-5692-43c6-9cd0-27863ea8c55c/9662d.svg'
const rewardAssetPath = 'https://www.figma.com/api/mcp/asset/53561d3d-7542-4a9a-9f25-7ceb1e1b8745'
const rewardGoogle = `${rewardAssetPath}/b5730.png`
const rewardOlive = `${rewardAssetPath}/7e2b8.png`
const rewardOliveLogo = `${rewardAssetPath}/66bb7.png`

const artifacts = [
  { name: '백자 청화 매죽문 호', era: '조선 후기', active: true },
  { name: '청자 상감 구름문 항아리', era: '고려시대', active: false },
  { name: '철제 갑옷', era: '조선시대', active: false },
  { name: '동제 부장품', era: '삼국시대', active: false },
  { name: '백제 금동여래입상', era: '백제시대', active: false },
]

const stamps = Array.from({ length: 5 }, (_, index) => index)

const findGameQuestions = [
  {
    name: '백자 청화 매죽문 호',
    era: '조선 후기',
    isReal: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/%EB%B0%B1%EC%9E%90_%EC%B2%AD%ED%99%94%EB%A7%A4%EC%A3%BD%EB%AC%B8_%ED%95%AD%EC%95%84%EB%A6%AC.jpg',
    fakeImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Gaya_Confederacy_Iron_Armor_01.jpg',
  },
  {
    name: '청자 상감 구름문 항아리',
    era: '고려시대',
    isReal: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/%EC%B2%AD%EC%9E%90_%EC%83%81%EA%B0%90_%EA%B8%88%EC%B1%84_%EA%B5%AD%ED%99%94_%EB%AC%B4%EB%8A%AC_%EC%9E%91%EC%9D%80_%ED%95%AD%EC%95%84%EB%A6%AC_%EA%B3%A0%EB%A0%A4-%E9%9D%91%E7%A3%81%E8%B1%A1%E5%B5%8C%E9%87%91%E5%BD%A9%E8%8F%8A%E8%8A%B1%E6%96%87%E5%B0%8F%E5%A3%BA_%E9%AB%98%E9%BA%97-Small_jar_and_cover_decorated_with_chrysanthemums%2C_cranes%2C_and_clouds_MET_DP253896.jpg',
    fakeImage: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Gilt-bronze_Seated_Vairocana_Buddha.jpg',
  },
  {
    name: '철제 갑옷',
    era: '조선시대',
    isReal: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Gaya_Confederacy_Iron_Armor_01.jpg',
    fakeImage: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Korea_Buyeo_Songgukri_tomb_artifacts.jpg',
  },
  {
    name: '동제 부장품',
    era: '삼국시대',
    isReal: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Korea_Buyeo_Songgukri_tomb_artifacts.jpg',
    fakeImage: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Goguryeo_Gilt_Bronze_Artifacts%2C_5th-6th_Cent._%2830115594591%29.jpg',
  },
  {
    name: '백제 금동여래입상',
    era: '백제시대',
    isReal: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Gilt-bronze_Seated_Vairocana_Buddha.jpg',
    fakeImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/%EB%B0%B1%EC%9E%90_%EC%B2%AD%ED%99%94%EB%A7%A4%EC%A3%BD%EB%AC%B8_%ED%95%AD%EC%95%84%EB%A6%AC.jpg',
  },
]

const placeGameArtifacts = findGameQuestions.map((artifact, index) => ({
  ...artifact,
  clue: [
    '푸른 안료로 대나무와 매화가 그려진 조선의 도자기예요.',
    '구름무늬를 상감 기법으로 장식한 고려의 도자기예요.',
    '금속으로 만든 전투용 보호 장비예요.',
    '무덤에서 함께 발견된 삼국시대 금속 유물이에요.',
    '금빛으로 빛나는 불상의 모습을 한 백제 유물이에요.',
  ][index],
}))

  const placeGameChoices = [
    placeGameArtifacts[2],
    placeGameArtifacts[4],
    placeGameArtifacts[1],
    placeGameArtifacts[0],
    placeGameArtifacts[3],
  ]

function App() {
  const [screen, setScreen] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const requestedScreen = searchParams.get('screen')
    return requestedScreen === 'game' || requestedScreen === 'find-game' || requestedScreen === 'place-game' || requestedScreen === 'reward'
      ? requestedScreen
      : 'home'
  })
  const [isPrototypeComplete] = useState(() => new URLSearchParams(window.location.search).get('complete') === '1')
  const [cameraError, setCameraError] = useState('')
  const [completionOpen, setCompletionOpen] = useState(isPrototypeComplete)
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpClosing, setHelpClosing] = useState(false)
  const [scannedCount, setScannedCount] = useState(isPrototypeComplete ? stamps.length : 1)
  const [findRound, setFindRound] = useState(0)
  const [findAnswered, setFindAnswered] = useState(false)
  const [findAnswerCorrect, setFindAnswerCorrect] = useState(false)
  const [placedArtifact, setPlacedArtifact] = useState(null)
  const [draggedArtifact, setDraggedArtifact] = useState(null)
  const [placeTarget, setPlaceTarget] = useState(0)
  const [placeFeedback, setPlaceFeedback] = useState('')
  const videoRef = useRef(null)

  const currentFindQuestion = findGameQuestions[findRound]

  const handleFindAnswer = (isReal) => {
    if (findAnswered) {
      return
    }

    const isCorrect = isReal === currentFindQuestion.isReal
    setFindAnswerCorrect(isCorrect)
    if (isCorrect && findRound === findGameQuestions.length - 1) {
      setScreen('reward')
      return
    }
    setFindAnswered(true)
  }

  const handleNextFindQuestion = () => {
    setFindRound((round) => (round + 1) % findGameQuestions.length)
    setFindAnswered(false)
    setFindAnswerCorrect(false)
  }

  const handlePlaceDrop = (event) => {
    event.preventDefault()
    if (draggedArtifact?.name === placeGameArtifacts[placeTarget].name) {
      setPlacedArtifact(draggedArtifact)
      setPlaceFeedback('정답이에요!')
      setDraggedArtifact(null)
    } else if (draggedArtifact) {
      setPlaceFeedback('유물의 설명을 다시 확인해보세요.')
      setDraggedArtifact(null)
    }
  }

  const handleNextPlaceQuestion = () => {
    setPlaceTarget((target) => target + 1)
    setPlacedArtifact(null)
    setPlaceFeedback('')
  }

  const handleRewardNavigation = () => {
    setScreen('reward')
  }

  const closeHelp = () => {
    setHelpClosing(true)
  }

  const handleScan = () => {
    setScannedCount((currentCount) => {
      const nextCount = Math.min(currentCount + 1, stamps.length)
      if (nextCount === stamps.length) {
        setCompletionOpen(true)
      }
      return nextCount
    })
  }

  useEffect(() => {
    if (screen !== 'scanner') {
      return undefined
    }

    let stream
    let cancelled = false

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('카메라를 사용할 수 없는 환경입니다.')
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        videoRef.current.srcObject = stream
        setCameraError('')
      } catch {
        setCameraError('카메라 권한을 허용하면 유물을 스캔할 수 있어요.')
      }
    }

    startCamera()

    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [screen])

  return (
    <div className="stampbook-screen">
      <div className={`stampbook-panel ${screen === 'scanner' ? 'is-scanner' : ''}`}>
        {screen === 'place-game' ? (
          <main className="place-game-page">
            <h1>여기인가 저기인가?<br />유물 위치 맞추기!</h1>
            <p className="place-question-count">문제 {placeTarget + 1} / {placeGameArtifacts.length}</p>
            <div className="place-game-board">
              <section
                className={`place-drop-zone ${placedArtifact ? 'has-artifact' : ''}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handlePlaceDrop}
                aria-label="유물을 놓는 자리"
              >
                {placedArtifact && <img src={placedArtifact.image} alt="배치한 유물" />}
              </section>
              <section className="place-clue" aria-live="polite">
                <p>{placeGameArtifacts[placeTarget].clue}</p>
                {placeFeedback && <small className="is-feedback">{placeFeedback}</small>}
                {placedArtifact && (
                  placeTarget < placeGameArtifacts.length - 1 ? (
                    <button type="button" className="place-next-button" onClick={handleNextPlaceQuestion}>
                      다음 문제
                    </button>
                  ) : (
                    <button type="button" className="place-next-button" onClick={handleRewardNavigation}>
                      보상 받기
                    </button>
                  )
                )}
              </section>
              <section className="place-artifact-list" aria-label="유물 목록">
                {placeGameChoices.map((artifact) => (
                  <button
                    key={artifact.name}
                    type="button"
                    className={`place-artifact-item ${placedArtifact?.name === artifact.name ? 'is-placed' : ''}`}
                    draggable="true"
                    onDragStart={() => setDraggedArtifact(artifact)}
                    onDragEnd={() => setDraggedArtifact(null)}
                  >
                    <img src={artifact.image} alt="" />
                  </button>
                ))}
              </section>
            </div>
          </main>
        ) : screen === 'reward' ? (
          <main className="reward-page">
            <section className="reward-intro">
              <p>Congratulation!</p>
              <h1>다음 화면을 직원에게<br />보여주시고 경품 받아가세요!</h1>
              <small>참여자 1명당 1회만 제공됩니다.</small>
            </section>
            <section className="reward-options">
              <div className="reward-option">
                <div className="reward-card reward-card-google">
                  <img src={rewardGoogle} alt="Google Play 기프트 카드" />
                </div>
                <p>Google Play 기프트 카드<br />5천원</p>
              </div>
              <span className="reward-or">또는</span>
              <div className="reward-option">
                <div className="reward-card reward-card-olive">
                  <img src={rewardOlive} alt="올리브영 모바일 금액권" />
                  <img src={rewardOliveLogo} alt="" className="reward-olive-logo" />
                </div>
                <p>올리브영 모바일 금액권<br />5천원</p>
              </div>
            </section>
            <button type="button" className="reward-exit" onClick={() => setScreen('home')}>종료하기</button>
          </main>
        ) : screen === 'find-game' ? (
          <main className="find-game-page">
            <h1>가짜일까 진짜일까?<br />유물 찾기!</h1>
            <section className="find-game-board" aria-label="진짜 유물 찾기 게임">
              <p className="find-game-count">{findRound + 1} / {findGameQuestions.length}</p>
              <p className="find-game-question">어떤 게 진짜일까?</p>
              <p className="find-game-artifact-name">{currentFindQuestion.name}</p>
              <button
                type="button"
                className={`find-game-choice ${findAnswered ? (findAnswerCorrect ? 'is-correct' : 'is-wrong') : ''}`}
                onClick={() => handleFindAnswer(true)}
              >
                <span className="find-game-photo real-photo">
                  <img src={currentFindQuestion.image} alt={`${currentFindQuestion.name} 실제 사진`} />
                </span>
              </button>
              <button
                type="button"
                className={`find-game-choice fake-choice ${findAnswered ? (!findAnswerCorrect ? 'is-correct' : 'is-wrong') : ''}`}
                onClick={() => handleFindAnswer(false)}
              >
                <span className="find-game-photo fake-photo">
                  <img src={currentFindQuestion.fakeImage} alt="가짜 유물 사진" />
                </span>
              </button>
              {findAnswered && (
                <div className="find-game-result">
                  <p className={`find-game-feedback ${findAnswerCorrect ? 'is-correct' : 'is-wrong'}`}>
                    {findAnswerCorrect ? '정답이에요!' : '다시 살펴보세요!'}
                  </p>
                  <button type="button" className="find-game-next" onClick={handleNextFindQuestion}>
                    다음 유물
                  </button>
                </div>
              )}
            </section>
          </main>
        ) : screen === 'game' ? (
          <main className="game-page">
            <h1>어떤 게임을<br />풀어볼까?</h1>
            <div className="game-options">
              <div className="game-choice">
                <button type="button" className="game-option game-option-find" onClick={() => setScreen('find-game')}>
                  <span>유물을 찾아라!<br />어느 것이 진짜일까?</span>
                </button>
                <p>진짜 유물과 가짜 유물을 구분해 찾아내요!</p>
              </div>
              <div className="game-choice">
                <button type="button" className="game-option game-option-place" onClick={() => setScreen('place-game')}>
                  <span>어디서 왔을까?<br />유물 자리 찾기!</span>
                </button>
                <p>유물의 원래 자리를 찾아 바르게 옮겨요!</p>
              </div>
            </div>
          </main>
        ) : screen === 'scanner' ? (
          <main className="scanner-page">
            <div className="camera-frame">
              <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
              {cameraError && <p className="has-error">{cameraError}</p>}
              <button
                type="button"
                className="camera-scan-target"
                aria-label="유물 스캔하기"
                onClick={handleScan}
              />
            </div>
          </main>
        ) : (
          <>
            <header className="progress-header">
              <div className="progress-title">유물 수집 진행도</div>
              <div className="progress-counter">{scannedCount}/{stamps.length}</div>

              <div className="progress-track" aria-label="Collect progress">
                {stamps.map((stamp) => (
                  <span
                    key={stamp}
                    className={`progress-stamp ${stamp < scannedCount ? 'is-collected' : 'is-empty'}`}
                    aria-hidden="true"
                  >
                    <span className="star">★</span>
                  </span>
                ))}
                <span className="progress-dash" aria-hidden="true" />
                <span className="progress-stamp is-final" aria-hidden="true">
                  <span className="star">★</span>
                </span>
              </div>
            </header>

            <main className="artifact-list">
              {artifacts.map(({ name, era, active }, index) => {
                const isCollected = active || index < scannedCount

                return (
                <article key={`${name}-${index}`} className={`artifact-card ${isCollected ? 'is-active' : ''}`}>
                  <div className={`artifact-thumb ${isCollected ? 'is-active' : ''}`}>
                    <img
                      src={isCollected ? imgGroup1 : imgGroup2}
                      alt=""
                      className="artifact-icon"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="artifact-copy">
                    <h2>{name}</h2>
                    <p>{era}</p>
                  </div>
                </article>
                )
              })}
            </main>
          </>
        )}

        {completionOpen && (screen === 'home' || screen === 'scanner') && (
          <div className="completion-overlay" role="presentation">
            <section
              className="completion-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="completion-title"
            >
              <div className="completion-copy">
                <p>유물을 모두 찾았다!</p>
                <h2 id="completion-title">마지막으로 퀴즈를 풀자!</h2>
              </div>
              <button
                type="button"
                className="quiz-button"
                onClick={() => {
                  setCompletionOpen(false)
                  setScreen('game')
                }}
              >
                간단한 게임 퀴즈 풀기
              </button>
            </section>
          </div>
        )}

        {helpOpen && (screen === 'home' || screen === 'scanner') && (
          <div className="help-overlay" role="presentation" onClick={closeHelp}>
            <section
              className={`help-modal ${helpClosing ? 'is-closing' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-title"
              onClick={(event) => event.stopPropagation()}
              onAnimationEnd={() => {
                if (helpClosing) {
                  setHelpOpen(false)
                  setHelpClosing(false)
                }
              }}
            >
              <div className="help-modal-header">
                <p id="help-title" className="help-modal-label">도움말</p>
              </div>
              <div className="help-modal-content">
                <div className="help-section">
                  <h2>카메라 화면이 검게 나와요</h2>
                  <p>브라우저(크롬/사파리) 상단 주소창 좌측의<br />설정(자물쇠) 아이콘을 눌러 '카메라 권한<br />허용'으로 변경한 뒤 새로고침해 주세요.</p>
                </div>
                <div className="help-section">
                  <h2>스탬프가 사라졌어요</h2>
                  <p>브라우저 캐시 삭제 또는<br />시크릿 모드/개인정보 보호 브라우징을<br />이용하면 스탬프가 저장되지 않습니다.<br />일반 탭에서 진행해 주세요.</p>
                </div>
                <div className="help-section help-location">
                  <h2>경품 수령 위치</h2>
                  <p>박물관 로비 내 '이벤트 운영 부스'</p>
                </div>
              </div>
              <div className="help-modal-footer">
                <button type="button" className="help-close" onClick={closeHelp}>닫기</button>
              </div>
            </section>
          </div>
        )}

        {(screen === 'home' || screen === 'scanner') && (
          <nav className="bottom-bar" aria-label="Bottom navigation">
            <img src={imgFrame6} alt="" className="bottom-nav-asset" aria-hidden="true" />
            <button
              type="button"
              className="home-navigation-button"
              aria-label="홈으로 이동"
              onClick={() => setScreen('home')}
            />
            <button
              type="button"
              className="scan-navigation-button"
              aria-label="카메라 스캔"
              onClick={() => setScreen(screen === 'scanner' ? 'home' : 'scanner')}
            />
            <button
              type="button"
              className="help-navigation-button"
              aria-label="도움말"
              onClick={() => setHelpOpen(true)}
            />
          </nav>
        )}
      </div>
    </div>
  )
}

export default App
