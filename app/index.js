import { h, render, Component } from 'preact'
import 'normalize.css'
import './style.css'
import './audio/popup-sfx.mp3'

const GENESIS_POPUPS = [
  { genesis: true, image: 8, left: 20, top: 20 },
  { genesis: true, image: 9, left: 30, top: 200 },
  { genesis: true, image: 10, left: 40, top: 400 },
]
const OFFSET_X_MD = 403
const OFFSET_X_SM = 350
const POPUP_INTERVAL = 200
const POPUP_MAX_TIME = 6000
const POPUP_START_DELAY = 6000
const TOTAL_POPUPS = 7
const VIDEO_SRC = 'https://www.youtube.com/embed/YmBAhjsUi44?autoplay=1'

const Popup = ({ index, onClose, popup }) => (
  <div
    className={`popup popup-${popup.image}`}
    style={{ left: `${popup.left}px`, top: `${popup.top}px` }}
  >
    <div className='popup-close' onClick={() => onClose(index)}></div>
  </div>
)

const YouTube = ({ src }) => (
  <div className='youtube-wrap'>
    <div className='youtube'>
      <iframe
        width='640'
        height='360'
        src={src}
        frameborder='0'
        allow='autoplay; encrypted-media'
        allowfullscreen>
      </iframe>
    </div>
  </div>
)

class Container extends Component {
  constructor() {
		super()

    // init state
		this.state = {
      images: TOTAL_POPUPS,
			offset: 0,
			popups: [],
      lastTime: 0,
      sfx: new Audio('popup-sfx.28d2df3e.mp3'),
      startTime: null,
      timer: 0,
      video: false,
      window: {},
		}
	}

	componentDidMount = () => {
    // get window dimensions
    this.setState({
      offset: window.innerWidth > 768 ? OFFSET_X_MD : OFFSET_X_SM,
      window: { x: window.innerWidth, y: window.innerHeight },
    })

    // start popup madness
    return setTimeout(() => this.startPopups(), POPUP_START_DELAY)
	}

  addPopup = ({ genesis=false, image, left, top } = {}) => {
    // new popup, with default or random image and coords based on window dimensions
    const popup = {
      genesis: genesis,
      image: image || this.random(this.state.images, 1),
      left: left || this.random(this.state.window.x - this.state.offset),
      top: top || this.random(this.state.window.y),
    }

    // play popup sfx, with delay to match animation delay
    if (genesis) {
      setTimeout(() => this.state.sfx.play(), 100)
    }

    // push new popup to state
    this.setState({ popups: [...this.state.popups, popup] })
  }

  addVideo = () => {
    // render video
    this.setState({ video: true })

    // play popup sfx, one last time
    setTimeout(() => this.state.sfx.play(), 200)
  }

	onPopupClose = (index) => {
    // remove popup
    this.setState({ popups: this.state.popups.filter((e, i) => i !== index) })

    // add new popup
    this.addPopup()
	}

  random = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  startPopups = () => {
    // stagger genesis popups
    GENESIS_POPUPS.map((popup, i) => {
      return setTimeout(() => this.addPopup(popup), i * 500)
    })

    // wait for genesis popups to render then start the madness
    return setTimeout(() => window.requestAnimationFrame(this.step), 3000)
  }

  step = ts => {
    // init timer start time
    if (!this.state.startTime) {
      this.setState({ startTime: ts })
    }

    // update timer progress
    this.setState({ timer: (ts - this.state.startTime) })

    if (this.state.timer < POPUP_MAX_TIME) {
      // throttle animation
      if ((ts - this.state.lastTime) > POPUP_INTERVAL) {
        // add new popup
        this.addPopup()

        // update last time
        this.setState({ lastTime: ts })
      }

      // rAF tick
      return window.requestAnimationFrame(this.step)
    } else {
      // finally, render video
      return this.addVideo()
    }
  }

  render(props, { popups, sfx, video }) {
		return (
      <main>
        <header>
          <a href="http://2mrecords.com/">
            <div className="logo"></div>
          </a>

          <nav>
            <a className="link">About</a>
            <a className="link">Products</a>
            <div className="icon icon-search"></div>
            <div className="icon icon-cart"></div>
          </nav>
        </header>

        <div className='box'>
          <div className='image'>
            <div className='lulu'></div>
          </div>

          <div className='text'>
            <h1 className='heading'>
              Say hello to <span className='highlight-red'>LULU</span>
            </h1>

            <h2 className='subheading'>
              You'll never be lonely again.
            </h2>

            <p className='tagline'>
              Our newest digital assistant is so smart, you'll think she's real.<br />
              The more you use her, the more useful she will become.
            </p>
          </div>
        </div>

        {popups && popups.map((popup, index) => (
          <Popup index={index} onClose={this.onPopupClose} popup={popup} />
        ))}

        {video && <YouTube src={VIDEO_SRC} />}
      </main>
    )
	}
}

const mountNode = document.getElementById('BananaSplit')

render(<Container />, mountNode, mountNode.lastChild)
