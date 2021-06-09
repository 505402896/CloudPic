<template>
  <div v-if="cameraIndexCode" :id="modelId" v-loading="loading" class="playWnd" :ref="modelId" style="width:460px;height:260px;">
  </div>
</template>
<script src="./jquery-1.12.4.min.js"></script>
<script src="./jsencrypt.min.js"></script>
<script src="./jsWebControl-1.0.0.min.js"></script>

<script>

export default {
  name: 'Monitor',
  props: {
    cameraIndexCode: {
      type: String,
      default: ''
    },
    modelId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      initCount: 0,
      pubKey: '',
      loading: false,
      oWebControl: null
    }
  },
  watch: {
    cameraIndexCode: {
      handler (val) {
        if (val) {
          this.initPlugin()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 创建播放实例
    initPlugin () {
      this.loading = true
      let _this = this
      this.oWebControl = new WebControl({
        szPluginContainer: _this.modelId,                         // 指定容器id
        iServicePortStart: 15900,                             // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11',    // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {                             // 创建WebControl实例成功
          _this.oWebControl.JS_StartService('window', {       // WebControl实例创建成功后需要启动服务
            dllPath: './VideoPluginConnect.dll'               // 值"./VideoPluginConnect.dll"写死
          }).then(() => {                                     // 启动插件服务成功
            _this.oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
              cbIntegrationCallBack: this.cbIntegrationCallBack
            })
            _this.oWebControl.JS_CreateWnd(_this.modelId, 443, 240).then(() => { // JS_CreateWnd创建视频播放窗口，宽高可设定
              _this.init()  // 创建播放实例成功后初始化
            })
          },() => { // 启动插件服务失败
          console.log('启动插件服务失败')
          })
        },
        cbConnectError: () => { // 创建WebControl实例失败
          _this.oWebControl = null
          // $("#playWnd").html("插件未启动，正在尝试启动，请稍候...")
          console.log('插件未启动，正在尝试启动，请稍候...')
          WebControl.JS_WakeUp('VideoWebPlugin://') // 程序未启动时执行error函数，采用wakeup来启动程序
          _this.initCount ++
          if (_this.initCount < 3) {
            setTimeout(() => {
              _this.initPlugin()
            }, 3000)
          } else {
            // $("#playWnd").html("插件启动失败，请检查插件是否安装！");
            console.log('插件启动失败，请检查插件是否安装！')
          }
        },
        cbConnectClose: (bNormalClose) => {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.log('cbConnectClose')
          this.oWebControl = null
        }
      })
    },
    // 设置窗口控制回调
    setCallbacks () {
      this.oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: this.cbIntegrationCallBack
      })
    },
    // 推送消息
    cbIntegrationCallBack (oData) {
      showCBInfo(JSON.stringify(oData.responseMsg))
    },
    // 初始化
    init () {
      this.getPubKey(() => {
        const appkey = '25841360'                           // 综合安防管理平台提供的appkey，必填
        const secret = this.setEncrypt('iS3DJDCihQadHsP7mSpQ')   // 综合安防管理平台提供的secret，必填
        const ip = '220.180.255.224'                        // 综合安防管理平台IP地址，必填
        const playMode = 0                                  // 初始播放模式：0-预览，1-回放
        const port = 443                                    // 综合安防管理平台端口，若启用HTTPS协议，默认443
        const snapDir = 'D:\\SnapDir'                       // 抓图存储路径
        const videoDir = 'D:\\VideoDir'                     // 紧急录像或录像剪辑存储路径
        const layout = '1x1'                                // playMode指定模式的布局
        const enableHTTPS = 1                               // 是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
        const encryptedFields = 'secret'                    // 加密字段，默认加密领域为secret
        const showToolbar = 0                               // 是否显示工具栏，0-不显示，非0-显示
        const showSmart = 1                                 // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        const buttonIDs = '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769'  //自定义工具条按钮
        const reconnectTimes = 3                             // 重连次数
        this.oWebControl.JS_RequestInterface({
          funcName: 'init',
          argument: JSON.stringify({
            appkey: appkey,                            // API网关提供的appkey
            secret: secret,                            // API网关提供的secret
            ip: ip,                                    // API网关IP地址
            playMode: playMode,                        // 播放模式（决定显示预览还是回放界面）
            port: port,                                // 端口
            snapDir: snapDir,                          // 抓图存储路径
            videoDir: videoDir,                        // 紧急录像或录像剪辑存储路径
            layout: layout,                            // 布局
            enableHTTPS: enableHTTPS,                  // 是否启用HTTPS协议
            encryptedFields: encryptedFields,          // 加密字段
            showToolbar: showToolbar,                  // 是否显示工具栏
            showSmart: showSmart,                      // 是否显示智能信息
            buttonIDs: buttonIDs,                      // 自定义工具条按钮
            reconnectTimes: reconnectTimes             // 重连次数
          })
        }).then((oData) => {
        this.oWebControl.JS_Resize(460, 260)  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        this.preview(this.cameraIndexCode)
        })
      })
    },
    // 获取公钥
    getPubKey (callback) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'getRSAPubKey',
        argument: JSON.stringify({ keyLength: 1024 })
        })
      .then((oData) => {
        if (oData.responseMsg.data) {
          this.pubKey = oData.responseMsg.data
          callback ()
        }
      })
    },
    // RSA加密
    setEncrypt (value) {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover () {
      let iWidth = document.documentElement.clientWidth
      let iHeight = document.documentElement.clientWidth
      let oDivRect = this.$refs[this.modelId].getBoundingClientRect()

      let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left): 0
      let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top): 0
      let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0
      let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0

      iCoverLeft = (iCoverLeft > 460) ? 460 : iCoverLeft
      iCoverTop = (iCoverTop > 260) ? 260 : iCoverTop
      iCoverRight = (iCoverRight > 460) ? 460 : iCoverRight
      iCoverBottom = (iCoverBottom > 260) ? 260 : iCoverBottom

      this.oWebControl.JS_RepairPartWindow(0, 0, 461, 260)    // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 260)
      }
      if (iCoverTop != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, 461, iCoverTop)    // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        this.oWebControl.JS_CuttingPartWindow(460 - iCoverRight, 0, iCoverRight, 260)
      }
      if (iCoverBottom != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 260 - iCoverBottom, 460, iCoverBottom)
      }
    },
    // 视频预览功能
    preview (code) {
      const cameraIndexCode = code                             // 获取输入的监控点编号值，必填
      const streamMode = 0                                      // 主子码流标识：0-主码流，1-子码流
      const transMode = 1                                       // 传输协议：0-UDP，1-TCP
      const gpuMode = 0                                         // 是否启用GPU硬解，0-不启用，1-启用
      const wndId = -1                                          // 播放窗口序号（在2x2以上布局下可指定播放窗口）

      // cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, '')
      // cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, '')

      this.oWebControl.JS_RequestInterface({
        funcName: 'startPreview',
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode,                // 监控点编号
          streamMode: streamMode,                         // 主子码流标识
          transMode: transMode,                           // 传输协议
          gpuMode: gpuMode,                               // 是否开启GPU硬解
          wndId: wndId                                     // 可指定播放窗口
        })
      })
      this.loading = false
    },
    // 停止全部预览
    stop () {
      this.oWebControl.JS_RequestInterface({
        funcName: "stopAllPreview"
      })
    },
    // 固定空间位置
    fixed () {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(460, 260)
        this.setWndCover()
      }
    },
    close () {
      if (this.oWebControl != null) {
      this.oWebControl.JS_HideWnd()   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
      this.oWebControl.JS_Disconnect().then(() => {  // 断开与插件服务连接成功
      },
        () => {  // 断开与插件服务连接失败
        console.log('断开与插件服务连接失败')
        })
      }
    }
  },
  destroyed () {
    this.close()
  }
}
</script>
