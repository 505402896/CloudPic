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
                :header-cell-style="{background:'#0A1121',borderColor:'#0A1121',textAlign:'center'}"
                style="width: 100%">
                <el-table-column style="cursor: pointer;" type="index" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="项目名称">
                  <template slot-scope="scope">
                    <span style="cursor: pointer;" @click="changeId(scope.row.projectId)">{{ scope.row.name }}</span>
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
                :total="listTotal">
              </el-pagination>
            </div>
            <div class="project-analyse project">
              <div class="title">项目月安装分析</div>
              <div class="pic"></div>
            </div>
            <div class="attendance project">
              <div class="title">工地今日出勤</div>
              <el-table
                :data="attendanceList"
                stripe
                :height="223"
                :header-cell-style="{background:'#0A1121',borderColor:'#0A1121',textAlign:'center'}"
                style="width: 100%;">
                <el-table-column prop="profession" label="工种" />
                <el-table-column prop="peopleNumber" label="人数" />
                <el-table-column prop="absenteeism" label="出勤" />
                <el-table-column prop="attendance" label="缺勤" />
              </el-table>
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
                    <div class="icon iconfont">&#xe6a3;</div>
                    <h3>{{ buildersNumber }}</h3>
                    <p>今日施工人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6d5;</div>
                    <h3>{{ `${duration} 天` }}</h3>
                    <p>工期</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6eb;</div>
                    <h3>{{ `${amountStructure} t` }}</h3>
                    <p>结构量</p>
                  </div>
                </div>
                <div class="data__left-down">
                  <div>
                    <div class="icon iconfont">&#xe6a3;</div>
                    <h3>{{ managerNumber }}</h3>
                    <p>管理人员人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6e0;</div>
                    <h3>{{ `${safetyPoduction} 天` }}</h3>
                    <p>安全生产</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6af;</div>
                    <h3>{{ `${projectArea} ㎡` }}</h3>
                    <p>项目面积</p>
                  </div>
                </div>
              </div>
              <div class="data__right">
                <div>
                  <span>PM2.5:</span><b>{{ fineParticulateMatter }}</b>
                </div>
                <div>
                  <span>PM10:</span><b>{{ inhalableParticle }}</b>
                </div>
                <div>
                  <span>SO2:</span><b>{{ sulfurDioxide }}</b>
                </div>
                <div>
                  <span>NO2:</span><b>{{ nitrogenDioxide }}</b>
                </div>
                <div>
                  <span>O3:</span><b>{{ ozone }}</b>
                </div>
                <div>
                  <span>CO:</span><b>{{ carbonicOxide }}</b>
                </div>
              </div>
            </div>
            <el-row>
              <el-col :span="18">
                <iframe class="model">
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
                  :header-cell-style="{background:'#0A1121',borderColor:'#0A1121',textAlign:'center'}"
                  style="width: 100%">
                    <el-table-column type="index" label="序号" />
                    <el-table-column prop="name" label="区域名">
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
            <div class="monitor" v-loading="loading">
              <monitor v-if="monitorArr.length !== 0" ref="monitorFirst" :camera-index-code="monitorFirst" modelId="playModeOne" />
              <div class="monitor__title" v-else>
                <span>监控未连接</span>
              </div>
            </div>
            <div class="monitor">
              <monitor v-if="monitorArr.length !== 0" :camera-index-code="monitorSec" modelId="playModeTwo" />
              <div class="monitor__title" v-else>
                <span>监控未连接</span>
              </div>
            </div>
            <div class="monitor">
              <!-- <monitor v-if="monitorArr.length !== 0" :camera-index-code="monitorArr[2]" style="padding:2px" /> -->
              <div class="monitor__title">
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
      monitorList: [], // 监控在线列表
      monitorFirst: '', // 第一个监控
      monitorSec: '', // 第二个监控
      monitorThird: '', // 第三个监控
      buildersNumber: 0, // 今日施工人数
      managerNumber: 0, // 管理人数
      duration: 0,  // 工期
      safetyPoduction: 0, // 安全生产天数
      amountStructure: 0, // 结构量
      projectArea: 0, // 项目面积
      fineParticulateMatter: 0, // PM2.5
      inhalableParticle: 0, // PM10
      sulfurDioxide: 0, // SO2
      nitrogenDioxide: 0, // NO2
      ozone: 0, // O3
      carbonicOxide: 0, // CO
      weather: '', // 天气现象
      temperature: '', // 实时温度
      windDirection: '', // 风力描述
      windPower: '', // 风力级别
      humidity: '' // 空气湿度
    }
  },
  computed: {
    loading () {
      return this.monitorArr.length === 0
    }
  },
  created () {
    this.$nextTick(() => {
      this.fetchData()
    })
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
    changeId (id) {
      this.currentProjectId = id
      this.fetchData()
    },
    changeMonitor (indexCode) {
      this.$refs.monitorFirst.stop()
      // this.monitorFirst = indexCode
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
          this.buildersNumber = otherData.data.buildersNumber
          this.managerNumber = otherData.data.managerNumber
          this.duration = otherData.data.duration
          this.safetyPoduction = otherData.data.safetyPoduction
          this.amountStructure = otherData.data.amountStructure
          this.projectArea = otherData.data.projectArea

          this.fineParticulateMatter = otherData.data.weatherVO.fineParticulateMatter
          this.inhalableParticle = otherData.data.weatherVO.inhalableParticle
          this.sulfurDioxide = otherData.data.weatherVO.sulfurDioxide
          this.nitrogenDioxide = otherData.data.weatherVO.nitrogenDioxide
          this.ozone = otherData.data.weatherVO.ozone
          this.carbonicOxide = otherData.data.weatherVO.carbonicOxide

          this.weather = otherData.data.weatherVO.weather
          this.temperature = otherData.data.weatherVO.temperature
          this.windDirection = otherData.data.weatherVO.windDirection
          this.windPower = otherData.data.weatherVO.windPower
          this.humidity = otherData.data.weatherVO.humidity

          this.attendanceList = otherData.data.gateCard
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">

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
    background: url('./img/2.jpg');
  }
  .app{
    position: relative;
    width: 100%;
    height: 100%;
  }
  header{
    width: 100%;
    height: 150px;
    margin-top: -50px;
    background: url('./img/3.png');
    h1{
      width: 100%;
      font-size: 38px;
      // font-family: YouYuan, Arial, sans-serif;
      color: $--primary-blue;
      text-align: center;
      line-height: 180px;
    }
    a{
      display: block;
      color: unset;
      text-decoration: none;
      background-image: linear-gradient(0deg, rgb(3, 175, 239) 0%, rgb(189, 240, 241) 95%);
      -webkit-text-fill-color: transparent;
      overflow: unset;
      white-space: unset;
      text-overflow: unset;
    }
  }
  main{
    // display: flex;
    margin: 0 30px;
    height: calc( 100vh - 150px );
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
  .el-table{
    padding: 0 2px;
    .el-table,.el-table__expanded-cell{
      // TODO 无效 修改样式
      background-color: black;
    }
  }
  .center{
    // width: 900px;
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
        height: 100%;
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
    }
  }
  .left{
    // flex: 1;
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
        tbody{
          background: transparent;
        }
      }
    }
  }
  .right{
    // flex: 1;
    height: 100%;
    .monitor{
      width: 100%;
      height: 260px;
      margin-bottom: 15px;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
      &__title{
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
