<template>
  <div class="app">
    <header>
      <h1>富煌钢构BIM+智慧工地数字化项目管理平台</h1>
    </header>
    <main>
      <el-row>
        <el-col :span="6">
          <div class="left">
            <div class="project-list project">
              <div class="title">项目列表</div>
              <el-table
                :data="projectList"
                stripe
                :cell-style="tableRowStyle"
                :header-cell-style="{background:'#2157B9',borderColor:'#2157B9',textAlign:'center'}"
                style="width: 100%">
                <el-table-column style="cursor: pointer;" type="index" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="项目名称" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <span style="cursor: pointer;" @click="changeId(scope.row)">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column style="cursor: pointer;" prop="radio" label="完成占比">
                  <template slot-scope="scope">
                    <el-progress v-if="scope.row.radio" :percentage="scope.row.radio"></el-progress>
                    <el-progress v-else :percentage="0"></el-progress>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                background
                small
                :current-page.sync="currentPage"
                :page-size="4"
                layout="prev, pager, next"
                style="text-align:center;"
                :total="listTotal">
              </el-pagination>
            </div>
            <div class="project-analyse project">
              <div class="title">项目月安装分析</div>
              <div class="pic"></div>
            </div>
            <div class="attendance project" style="overflow:hidden;">
              <div class="title">工地今日出勤</div>
                <ul class="attendance__th">
                  <li style="flex:1;">工种</li>
                  <li style="flex:1;">人数</li>
                  <li style="flex:1;">出勤</li>
                  <li style="flex:1;">缺勤</li>
                </ul>
                <div class="attendance__tb">
                <vue-seamless-scroll :data="attendanceList" :class-option="defaultOption" class="seamless-warp">
                    <ul>
                      <li v-for="(item,index) in attendanceList" :key="index">
                      <span>{{ item.profession }}</span>
                      <span>{{ item.peopleNumber }}</span>
                      <span>{{ item.absenteeism }}</span>
                      <span>{{ item.attendance }}</span>
                      </li>
                    </ul>
                </vue-seamless-scroll>
                </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="center">
            <div class="title">
              <h2>{{ currentProjectName }}</h2>
            </div>
            <div class="data">
              <div class="data__left">
                <div class="data__left-up">
                  <div>
                    <div class="icon iconfont" style="color:#40A9FF;">&#xe6a3;</div>
                    <h3 v-if="projectInfo.buildersNumber">{{ projectInfo.buildersNumber }}</h3>
                    <h3 v-else>0</h3>
                    <p>今日施工人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont" style="color:#FAAD14;">&#xe6d5;</div>
                    <h3 v-if="projectInfo.duration">{{ `${projectInfo.duration} 天` }}</h3>
                    <h3 v-else>0 天</h3>
                    <p>工期</p>
                  </div>
                  <div>
                    <div class="icon iconfont" style="color:#D9D9D9;">&#xe6eb;</div>
                    <h3 v-if="projectInfo.amountStructure">{{ projectInfo.amountStructure | unitFormat }} t</h3>
                    <h3 v-else>0 t</h3>
                    <p>结构量</p>
                  </div>
                </div>
                <div class="data__left-down">
                  <div>
                    <div class="icon iconfont" style="color:#07CFB4;">&#xe6a3;</div>
                    <h3 v-if="projectInfo.managerNumber">{{ projectInfo.managerNumber }}</h3>
                    <h3 v-else>0</h3>
                    <p>管理人员人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont" style="color:#FF4D4F;">&#xe6e0;</div>
                    <h3 v-if="projectInfo.safetyPoduction">{{ `${projectInfo.safetyPoduction} 天` }}</h3>
                    <h3 v-else>0 天</h3>
                    <p>安全生产</p>
                  </div>
                  <div>
                    <div class="icon iconfont" style="color:#FFD666;">&#xe6af;</div>
                    <h3 v-if="projectInfo.projectArea">{{ projectInfo.projectArea | unitFormat }} ㎡</h3>
                    <h3 v-else>0 ㎡</h3>
                    <p>项目面积</p>
                  </div>
                </div>
              </div>
              <div class="data__right">
                <vue-seamless-scroll :data="weatherList" :class-option="defaultOption" class="seamless-warp">
                  <ul>
                    <li v-for="(item,index) in weatherList" :key="index">
                      <span class="name" v-text="item.name"></span>
                      <span class="data" v-text="item.data" style="margin-left:10px;color:#fff;font-weight:700;"></span>
                    </li>
                  </ul>
                </vue-seamless-scroll>
              </div>
            </div>
            <el-row>
              <el-col :span="18">
                <iframe class="model" :src="modelURL">
                </iframe>
              </el-col>
              <el-col :span="6">
                <div class="monitorList">
                  <div class="monitorList__title">
                    <span>监控列表（在线）</span>
                  </div>
                  <el-table
                  :data="monitorList"
                  stripe
                  :height="514"
                  :cell-style="tableRowStyle"
                  :header-cell-style="{background:'#2157B9',borderColor:'#2157B9',textAlign:'center'}"
                  style="width: 100%">
                    <el-table-column type="index" label="序号" />
                    <el-table-column prop="name" :show-overflow-tooltip="true" label="区域名">
                      <template slot-scope="scope">
                        <span style="cursor: pointer;" @click="changeMonitor(scope.row.indexCode)">{{ scope.row.name }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="right">
            <div :class="{'monitor': true, 'border': !hasMonitor && !monitorFirst}">
              <monitor v-if="hasMonitor && monitorFirst" ref="monitorFirst" :camera-index-code="monitorFirst" modelId="playModeOne" />
              <div class="monitor__title" v-else>
                <span>监控未连接</span>
              </div>
            </div>
            <div :class="{'monitor': true, 'border': !hasMonitor && !monitorSec}">
              <monitor v-if="hasMonitor && monitorSec" ref="monitorSec" :camera-index-code="monitorSec" modelId="playModeTwo" />
              <div class="monitor__title" v-else>
                <span>监控未连接</span>
              </div>
            </div>
            <div :class="{'monitor': true, 'border': !hasMonitor && !monitorThird}">
              <monitor v-if="hasMonitor && monitorThird" ref="monitorThird" :camera-index-code="monitorThird" modelId="playModeThree"/>
              <div class="monitor__title" v-else>
                <span>监控未连接</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>
  </div>
</template>
<script>
import { getChart, getProjectList, getMonitor, get } from '@/api/data'
import Monitor from '@/components/monitor/index.vue'
export default {
  name: 'App',
  components: { Monitor },
  data () {
    return {
      myChart: null,
      projectList: [],
      attendanceList: [],
      listTotal: null,
      currentPage: 1,
      currentProjectId: undefined,
      currentProjectName: '',
      meteArr: [],
      monitorArr: [],
      weatherList: [],
      monitorList: [], // 监控在线列表
      monitorFirst: '', // 第一个监控
      monitorSec: '', // 第二个监控
      monitorThird: '', // 第三个监控
      projectInfo: {
        buildersNumber: 0, // 今日施工人数
        managerNumber: 0, // 管理人数
        duration: 0,  // 工期
        safetyPoduction: 0, // 安全生产天数
        amountStructure: 0, // 结构量
        projectArea: 0 // 项目面积
      }
    }
  },
  computed: {
    defaultOption () {
      return {
        step: 0.1, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    },
    hasMonitor () {
      return this.monitorArr.length !== 0
    },
    modelURL () {
      return 'https://fhgg.hzchum.com/fh/'
    }
  },
  filters: {
    unitFormat (value) {
      return value.toFixed().replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
    }
  },
  created () {
    this.$nextTick(() => {
      this.fetchData()
    })
  },
  mounted () {
    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    window.onscroll = () => {
      this.$refs.monitorFirst.fixed()
      this.$refs.monitorSec.fixed()
      this.$refs.monitorThird.fixed()
    }
    // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
    window.onresize = () => {
      this.$refs.monitorFirst.fixed()
      this.$refs.monitorSec.fixed()
      this.$refs.monitorThird.fixed()
    }
  },
  watch: {
    currentPage: {
      handler () {
        this.fetchProject()
      },
      immediate: true
    }
  },
  methods: {
    init () {
      this.myChart = this.$echarts.init(document.querySelector('.pic'))
      this.myChart.setOption({
        grid: {
          top: '10px',
          left: '50px',
          right: '10px',
          bottom: '40px'
        },
        label: {
          show: true
        },
        textStyle: {
          color: '#d6e0eb'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          splitLine: {
            show: false
          },
          type: 'value'
        },
        color: ['#0a73ff'],
        series: [{
          data: this.meteArr,
          type: 'bar',
          barWidth: 15,
          showBackground: true,
          backgroundStyle: {
          }
        }]
      })
    },
    tableRowStyle ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'background-color:#102F8D;border:none'
      } else {
        return 'background-color:#0C2573;border:none'
      }
    },
    changeId (row) {
      this.currentProjectId = row.id
      this.currentProjectName = row.name
      this.fetchData()
    },
    changeMonitor (indexCode) {
      this.$refs.monitorFirst.stop()
      this.$refs.monitorFirst.preview(indexCode)
    },
    async fetchProject () {
      try {
        const projectList = await getProjectList({ page: this.currentPage, size: 4, productType: 1 })
        if (projectList) {
          this.listTotal = projectList.data.totalElements
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getMonitor () {
      const monitorRes = await getMonitor({ pageNo: 1, pageSize: 100, projectId: this.currentProjectId })
      this.monitorArr = []
      if (monitorRes) {
        this.monitorList = monitorRes.data.content.map(v => {
          // 在线设备为1  离线为0
          if (v.online === 1) {
            this.monitorArr.push(v.indexCode)
            v.name = v.cn
            return v
          }
        })
        this.monitorFirst = this.monitorArr[0]
        this.monitorSec = this.monitorArr[1]
        this.monitorThird = this.monitorArr[2]
      }
    },
    async fetchData () {
      try {
        const projectList = await getProjectList({ page: this.currentPage, size: 4, productType: 1 })
        if (projectList) {
          this.listTotal = projectList.data.totalElements
        }
        // 默认页面打开时显示第一个项目的数据
        if (this.currentProjectId === undefined && projectList) {
          this.currentProjectId = projectList.data.content[0].id
          this.currentProjectName = projectList.data.content[0].name

          this.projectList = projectList.data.content.map(v => {
            v.radio = Number((v.mete / v.totalMete * 100).toFixed(1))
            v.projectId = v.id
            return v
          })
        }
        const chart = await getChart({ projectId: this.currentProjectId, productType: 1, date: Date.parse(new Date()) })
        const mete = []
        if (chart && chart.data) {
          // 默认12个月都为0
          this.meteArr = new Array(12).fill(0)
          chart.data.months.map(v => {
            mete.push({ month: Number(v.date.substring(5)), mete: v.mete, quantity: v.quantity })
          })
          for (let i = 0; i <= 12; i++) {
            mete.map(v => {
              if (i + 1 === v.month) {
                this.meteArr[i] = v.mete
              }
            })
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.init()
        this.fetchOtherData()
        this.getMonitor()
      }
    },
    async fetchOtherData () {
      try {
        const otherData = await get({ projectId: this.currentProjectId })
        if (otherData && otherData.data) {
          this.projectInfo.buildersNumber = otherData.data.buildersNumber
          this.projectInfo.managerNumber = otherData.data.managerNumber
          this.projectInfo.duration = otherData.data.duration
          this.projectInfo.safetyPoduction = otherData.data.safetyPoduction
          this.projectInfo.amountStructure = otherData.data.amountStructure
          this.projectInfo.projectArea = otherData.data.projectArea

          this.weatherList = [
            { name: 'PM2.5:', data: otherData.data.weatherVO.fineParticulateMatter },
            { name: 'PM10:', data: otherData.data.weatherVO.inhalableParticle },
            { name: 'SO2:', data: otherData.data.weatherVO.sulfurDioxide },
            { name: 'NO2:', data: otherData.data.weatherVO.nitrogenDioxide },
            { name: 'O3:', data: otherData.data.weatherVO.ozone },
            { name: 'CO:', data: otherData.data.weatherVO.carbonicOxide },
            { name: '天气现象:', data: otherData.data.weatherVO.weather },
            { name: '实时温度:', data: otherData.data.weatherVO.temperature },
            { name: '风力描述:', data: otherData.data.weatherVO.windDirection },
            { name: '风力级别:', data: otherData.data.weatherVO.windPower },
            { name: '空气湿度:', data: otherData.data.weatherVO.humidity }
          ]
          this.attendanceList = otherData.data.gateCard
        } else {
          this.attendanceList = []
          this.projectInfo = {}
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
$--deep-blue: #2157B9;
$--primary-blue: #5fd0f1;
$--light-blue: #6bc1ff;
$--bc-blue: #3488ed80;
$--grey: rgb(214,224,235);

  *{
    padding: 0;
    margin: 0;
  }
  body{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    // background: url('./img/2.jpg');
    background-image: linear-gradient(60deg, #080c3b 0%, #05118f 57%, #080c3b 97%);
  }
  .app{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .border {
    border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
  }
  /*定义滚动条样式（高宽及背景）*/
  ::-webkit-scrollbar {
    width: 5px; /* 滚动条宽度， width：对应竖滚动条的宽度 height：对应横滚动条的高度*/
    background: #fff;
  }
    /*定义滚动条轨道（凹槽）样式*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px #afaeae; /* 较少使用 */
    border-radius: 10px;
  }
    /*定义滑块 样式*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    width: 10px;
    height: 50px; /* 滚动条滑块长度 */
    background-color: #afaeae;
  }
  header{
    position: relative;
    width: 100%;
    height: 150px;
    margin-top: -50px;
    background: url('./img/3.png');
    h1{
      width: 100%;
      font-size: 35px;
      font-family: YouYuan, Arial, sans-serif;
      color: $--primary-blue;
      text-align: center;
      line-height: 180px;
    }
  }
  main{
    margin: 0 30px;
    height: calc( 100vh - 150px );
  }
  .el-table, .el-table__expanded-cell{
    background-color: transparent !important;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: transparent !important;
  }
  .el-table__body{
    tr,tr:hover{
      font-size: 10px;
      color: #fff;
    }
  }
  .el-progress__text {
    color: #fff !important;
  }
  @font-face {
  font-family: 'iconfont';  /* Project id 2121632 */
  src: url('//at.alicdn.com/t/font_2121632_2s34p82p7nq.woff2?t=1622701758663') format('woff2'),
       url('//at.alicdn.com/t/font_2121632_2s34p82p7nq.woff?t=1622701758663') format('woff'),
       url('//at.alicdn.com/t/font_2121632_2s34p82p7nq.ttf?t=1622701758663') format('truetype');
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .center{
    height: 100%;
    margin: 0 20px;
    .title{
      height: 45px;
      background: $--light-blue;
      border-radius: 10px;
      h2{
        color: #fff;
        line-height: 45px;
        font-size: 24px;
        font-family: arial, Arial, sans-serif;
        text-align: center;
        font-weight: normal;
      }
    }
    .data{
      position: relative;
      height: 215px;
      margin-bottom: 15px;
      color: #fff;
      .icon{
        float: left;
        width: 50px;
        height: 50px;
        margin: 0 10px;
        font-size: 50px;
      }
      &__left{
        position: absolute;
        left: 0;
        margin: 20px 0;
        width: 80%;
        height: 100%;
        &-up{
          display: flex;
          width: 100%;
          height: 50%;
          div{
            flex: 1;
          }
        }
        &-down{
          display: flex;
          width: 100%;
          height: 50%;
          div{
            flex: 1;
          }
        }
      }
      &__right{
        position: absolute;
        right: 0;
        width: 20%;
        height: 175px;
        overflow: hidden;
        font-size: 17px;
        margin: 20px 0;
        line-height: 25px;
        span{
          color: $--light-blue;
        }
        b{
          margin-left: 10px;
        }
      }
    }
    .model{
      position: relative;
      width: 100%;
      height: 531px;
      background-color: $--grey;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
    }
    .monitorList{
      width: calc(100% - 10px);
      height: 535px;
      margin-left: 10px;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
      &__title{
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      .el-table{
        height: calc(100% - 70px);
        thead{
          color: #fff;
          height: 20px;
        }
        th,td{
          padding: 5px 0;
        }
        tbody{
          background: transparent;
        }
      }
    }
  }
  .left{
    height: 100%;
    .project{
      position: relative;
      height: 260px;
      margin-bottom: 15px;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
      .title{
        color: #fff;
        padding: 8px;
        font-size: 14px;
      }
      .attendance{
        position: relative;
        width: 100%;
        &__th{
          display:flex;
          padding: 8px;
          width: 100%;
          background: $--deep-blue;
          color:#fff;
          font-weight: 700;
          font-size: 12px;
          list-style-type: none;
        }
        &__tb{
          width: 100%;
          overflow:hidden;
          color:#fff;
          padding: 8px;
          li{
            width:100%;
            display:flex;
            line-height: 30px;
            span{
              flex: 1;
            }
          }
        }
      }
      .pic{
        width: 100%;
        height: calc( 100% - 20px );
      }
      .el-table{
        height: calc(100% - 70px);
        thead{
          color: #fff;
          height: 20px;
        }
        th,td{
          padding: 5px 0;
        }
      }
    }
  }
  .right{
    height: 100%;
    .monitor{
      width: 100%;
      height: 260px;
      margin-bottom: 15px;
      &__title{
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
