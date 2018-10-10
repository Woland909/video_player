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
        this._toggleBtn = document.querySelector(`.toggle`);
        //находим в разметке div progress
        this._progressFilled = document.querySelector(`${this._settings.VideoPlayerContainer} .progress__filled`);
        //находим в разметке input range (громкость)
        this._player__slider = document.querySelector(`${this._settings.VideoPlayerContainer} .player__slider`);

        // Устанавливаем события
        this._setEvents();

        return this;
    }

    toggle(e) {
        const method = this._video.paused ? "play" : "pause";
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
        this._video[method](); //this._video["play"]();
    }

    _handleProgress(e) {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progressFilled.style.flexBasis = `${percent}%`;
    }

    valume(e) {
        this._video.volume =  this._player__slider.value     
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
        this._player__slider.addEventListener("click", e => this.valume(e));
        this._player__slider.addEventListener("mousemove", e => this.valume(e));
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
                <input type="range" name="playbackRate" class="player__slider" min="1" max="2" step="0.5" value="1">
                <button data-skip="-1" class="player__button">« 1s</button>
                <button data-skip="1" class="player__button">1s »</button>
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
             value: 0.5
         }
    }
}

/**
 * Настройки которые передал пользователь 
 */
const myplayer = new VideoPlayerBasic({
    videoUrl: "video/mov_bbb.mp4",
    VideoPlayerContainer: ".myplayer1"

}).init();
