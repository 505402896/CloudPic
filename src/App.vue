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
                :header-cell-style="{background:'#0a73ff',borderColor:'#CECECE',textAlign:'center'}"
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
                :header-cell-style="{background:'#0a73ff',borderColor:'#CECECE',textAlign:'center'}"
                style="width: 100%">
                <el-table-column prop="type" label="工种" />
                <el-table-column prop="projectName" label="人员" />
                <el-table-column prop="test" label="出勤" />
                <el-table-column prop="test" label="缺勤" />
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="center">
            <div class="title">
              <h2>***国际办公c区</h2>
            </div>
            <div class="data">
              <div class="data__left">
                <div class="data__left-up">
                  <div>
                    <div class="icon iconfont">&#xe6a3;</div>
                    <h3>XXX</h3>
                    <p>今日施工人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6d5;</div>
                    <h3>XXX</h3>
                    <p>工期</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6eb;</div>
                    <h3>XXX</h3>
                    <p>结构量</p>
                  </div>
                </div>
                <div class="data__left-down">
                  <div>
                    <div class="icon iconfont">&#xe6a3;</div>
                    <h3>XXX</h3>
                    <p>管理人员人数</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6e0;</div>
                    <h3>XXX</h3>
                    <p>安全生产</p>
                  </div>
                  <div>
                    <div class="icon iconfont">&#xe6af;</div>
                    <h3>XXX</h3>
                    <p>项目面积</p>
                  </div>
                </div>
              </div>
              <div class="data__right">
                <div>
                  <span>PM2.5:</span><b>33μg/m3</b>
                </div>
                <div>
                  <span>PM10:</span><b>33μg/m3</b>
                </div>
                <div>
                  <span>SO2:</span><b>33μg/m3</b>
                </div>
                <div>
                  <span>NO2:</span><b>33μg/m3</b>
                </div>
                <div>
                  <span>O3:</span><b>33μg/m3</b>
                </div>
                <div>
                  <span>CO:</span><b>33μg/m3</b>
                </div>
              </div>
            </div>
            <!-- 改为iframe -->
            <iframe class="model">
            </iframe>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="right">
            <div class="monitor">
              <div class="monitor__title">
                <span>监控未连接</span>
              </div>
              <monitor v-if="monitorArr.length !== 0" :camera-index-code="monitorArr[0]" />
            </div>
            <div class="monitor">
              <div class="monitor__title"><span>监控未连接</span></div>
              </div>
            <div class="monitor">
              <div class="monitor__title"><span>监控未连接</span></div>
              </div>
          </div>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script>
import { getData, getProjectList, getMonitor } from '@/api/data'
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
      meteArr: [],
      monitorArr: []
    }
  },
  created () {
    this.$nextTick(() => {
      this.getMonitor()
    })
  },
  mounted () {
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
    async fetchProject () {
      const projectList = await getProjectList({ page: this.currentPage, size: 4, productType: 1 })
      this.listTotal = projectList.data.totalElements
    },
    async getMonitor () {
      const monitorRes = await getMonitor({ pageNo: 1, pageSize: 100 })
      console.log(monitorRes)
      this.monitorArr = monitorRes.data['资源唯一编码(在线)']
    },
    async fetchData () {
      const projectList = await getProjectList({ page: this.currentPage, size: 4, productType: 1 })
      this.listTotal = projectList.data.totalElements
      // 默认页面打开时显示第一个项目的数据
      if (this.currentProjectId === undefined) {
        this.currentProjectId = projectList.data.content[0].id
      }
      this.projectList = projectList.data.content.map(v => {
        v.radio = Number((v.mete / v.totalMete * 100).toFixed(1))
        v.projectId = v.id
        return v
      })
      const res = await getData({ projectId: this.currentProjectId, productType: 1, date: Date.parse(new Date()) })
      const mete = []
      // 默认12个月都为0
      this.meteArr = new Array(12).fill(0)
      res.data.months.map(v => {
        mete.push({ month: Number(v.date.substring(5)), mete: v.mete, quantity: v.quantity })
      })
      for (let i = 1; i <= 12; i++) {
        mete.map(v => {
          if (i === v.month) {
            this.meteArr[i] = v.mete
          }
        })
      }
      this.init()
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
  .center{
    // width: 900px;
    height: 100%;
    margin: 0 20px;
    .title{
      height: 56px;
      background: $--light-blue;
      border-radius: 10px;
      h2{
        color: #fff;
        line-height: 56px;
        font-size: 24px;
        font-family: arial, Arial, sans-serif;
        text-align: center;
        font-weight: normal;
      }
    }
    .data{
      position: relative;
      height: 184px;
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
      height: 491px;
      background-color: $--grey;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
      &__title{
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 9;
        height: 30px;
      }
    }
  }
  .left{
    // flex: 1;
    height: 100%;
    .project{
      position: relative;
      height: 240px;
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
      height: 240px;
      margin-bottom: 15px;
      border-image: url('./img/1.png') 32 37 fill / 32px 37px / 0 stretch;
      &__title{
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
