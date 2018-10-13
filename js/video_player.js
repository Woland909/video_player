class VideoPlayerBasic {
    /**
     * Принемаем обьект с настройками которые передал пользователь, сравниваем их и заменяем дефолтные настройки на пользовательские.
     * @param {obj} settings 
     */
    constructor(settings) {
        this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);  
    }
    
    /**
     * Метод init.
     * Производим проверку на наличие кретических свойств в настройках.
     * Производим запуск методов инициализации разметки и events.
     * Возвращаем публичные методы.
     */
    init() {
        if (!this._settings.videoUrl) return console.error("Пожалуйста задайте адрес видео!");
        if (!this._settings.VideoPlayerContainer) return console.error("Пожалуйста задайте в виде css селектора контейнер для видео!");

        // Создали и добавили разметку 
        VideoPlayerBasic.addTemplate(this._settings);

        //находим видеоплеер в разметке
        this._video = document.querySelector(`${this._settings.VideoPlayerContainer} .player__video`);
        //находим в разметке кнопку play : pause
        this._toggleBtn = document.querySelector(`${this._settings.VideoPlayerContainer} .toggle`);
        //находим в разметке div progress
        this._progressFilled = document.querySelector(`${this._settings.VideoPlayerContainer} .progress__filled`);
        //находим в разметке input range (громкость)
        this._player__slider = document.querySelector(`${this._settings.VideoPlayerContainer} .player__slider`);
        //находим в разметке progress
        this._progressContainer = document.querySelector(`${this._settings.VideoPlayerContainer} .progress`);
        this._mouseDown = false;
        
        // Устанавливаем события
        this._setEvents();

        return this;
    }

    toggle(e) {
        const method = this._video.paused ? "play" : "pause";
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
        this._video[method](); //this._video["play"]();
    }

    _scrub(e) { 
        if(e.type === "click" || this._mouseDown){
        this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration};
    }

    _handleProgress(e) {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progressFilled.style.flexBasis = `${percent}%`;
    }

    valume(e) {
        this._video.volume =  this._player__slider.value;  
    }

    play() {
        this._video.play();
    }

    pause() {
        this._video.pause();
    }

    stop() {
        this._video.pause();
        this._video.currentTime = 0;
    }

    /**
     * ф-ия обрабатывает события на видеоплеере
     * @param {obj} settings 
     */
    _setEvents() {
        this._video.addEventListener("click", e => this.toggle(e));
        this._toggleBtn.addEventListener("click", e => this.toggle(e));
        this._video.addEventListener("timeupdate", e => this._handleProgress(e));
        this._player__slider.addEventListener("input", e => this.valume(e));
        this._progressContainer.addEventListener("click", e => this._scrub(e));
        this._progressContainer.addEventListener("mousemove", e => this._scrub(e));
        this._progressContainer.addEventListener("mousedown", e => this._mouseDown = true);
        this._progressContainer.addEventListener("mouseup", e => this._mouseDown = false);
    }

    /**
     * Ф-ия которая передает разметку плеера в настройки
     */
    static addTemplate(settings) {
        const template = VideoPlayerBasic.template(settings);
        document.querySelector(settings.VideoPlayerContainer).insertAdjacentHTML("afterbegin", template);
    }

    /**
     * Ф-ия которая создает разметку плеера
     */
    static template(settings) {
        const videoTemplate = `<video class="player__video viewer" src="${settings.videoUrl }"> </video>`;

        const controlsTemplate = `
            <div class="player__controls">
                <div class="progress">
                    <div class="progress__filled"></div>
                </div>
                <button class="player__button toggle" title="Toggle Play">►</button>
                <input type="range" name="volume" class="player__slider" min= "0" max="1" step="0.05" value="1">
            </div>
        `;

        return `
            ${videoTemplate}
            ${settings.controls ? controlsTemplate : ""}
        `;
    }

    /**
     * Дефолтные настройки видео плеера
     */
    static getDefaultSettings() {
        /**
         * Список настроек
         * - адрес видео
         * - тип плееера "basic", "pro"
         * - controls: true, false
         * - loop: true, false
         * - value: 0 - 1
         */

         return {
             videoUrl: "",
             VideoPlayerContainer: ".myplayer",
             playerType: "basic",
             controls: true,
             loop: false,
             value: 1
         }
    }
}

class VideoPlayerPro extends VideoPlayerBasic {
    constructor(settings) {
        super(settings);
    }

    init() {
        super.init();

        //Получаем настройки пользователя с дефолтними
        VideoPlayerPro.updateVideoPlayerTemplate(this._settings);

        //нашли EI
        this.playbackRate = document.querySelector(`${this._settings.VideoPlayerContainer} .player__slider2`); 
        this.skipPlus =  document.querySelector(`${this._settings.VideoPlayerContainer} .plus_skip`);
        this.skipMin =  document.querySelector(`${this._settings.VideoPlayerContainer} .minus_skip`);
        
        // Устанавливаем события
        this._setEventsPro();
    }


    playbackRatePro(e) {
        this._video.playbackRate =  this.playbackRate.value;
    }

    skipTime(e) {
        if (e.toElement.className === 'player__button plus_skip') {
            this._video.currentTime += parseFloat(this.skipPlus.getAttribute("data-skip"));
        }
        if (e.toElement.className === 'player__button minus_skip') {
            this._video.currentTime += parseFloat(this.skipMin.getAttribute("data-skip"));
        }
    }

    //Собития 
    _setEventsPro() {
        this.playbackRate.addEventListener("input", e => this.playbackRatePro(e));
        this.skipPlus.addEventListener("click", e => this.skipTime(e));
        this.skipMin.addEventListener("click", e => this.skipTime(e));
    }

    //добавляем в конец разметки proVideoControlsTemplate
    static updateVideoPlayerTemplate(settings) {
        const template = VideoPlayerPro.proVideoControlsTemplate(settings);
        document.querySelector(`${settings.VideoPlayerContainer} .player__controls`).insertAdjacentHTML("beforeend", template);
    }



    //новая разметка
    static proVideoControlsTemplate(settings) {
        return `
        <input type="range" name="playbackRate" class="player__slider2" min="0.5" max="2" step="0.1" value="${settings.defaultPlaybackRate || 0.1}">
        <button data-skip="${-settings.skipTime || -1}" class="player__button minus_skip">« ${settings.skipTime || 1}s</button>
        <button data-skip="${settings.skipTime || 1}" class="player__button plus_skip">${settings.skipTime || 1}s »</button> 
        `;
    }

}

/**
 * Настройки которые передал пользователь 
 */
const myplayer = new VideoPlayerBasic({
    videoUrl: "video/mov_bbb.mp4",
    VideoPlayerContainer: ".myplayer1"

}).init();

const myplayerPro = new VideoPlayerPro({
    videoUrl: "video/mov_bbb.1.mp4",
    VideoPlayerContainer: ".myplayer2",
    defaultPlaybackRate: 1.5,
    skipTime: 2
}).init();
