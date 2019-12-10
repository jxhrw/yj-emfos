<template>
  <el-menu class="el-menu-vertical-demo" @select="handleOpen" background-color="#1F212E" text-color="#646F7D"
    :default-active="keyPath" active-text-color="#00C187">
    <el-submenu v-for="(item, idx) in menus" :key="idx" :disabled="isabled(item.isabled)" :index="getIdx(idx)">
      <template slot="title">
        <i class="icon-menu-tools"></i>
        <span slot="title" :class="isabled(item.isabled)?'disabled':''">{{item.name}}</span>
      </template>
      <el-menu-item class="el-menu-vertical-demo" v-for="(cItem, cIdx) in item.children" :key="cIdx"
        :index="getIdx(idx,cIdx)" @click="gotoUrl(cItem)">{{cItem.name}}</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  import Common from "@/assets/js/common.js";
  export default {
    data() {
      return {
        keyPath: '1',
        menus: [{
            name: "基础管理",
            children: [],
            isabled: false
          },
          {
            name: "维修",
            children: [{
                name: "设备报修",
                children: [],
                url: '/eqpm.html',
                isabled: true
              },
              {
                name: "一键报修",
                children: [],
                url: '/eqpm.html',
                isabled: true
              },
              {
                name: "报修管理",
                children: [],
                url: '/repm.html',
                isabled: true
              },
              {
                name: "创建工单",
                children: [],
                url: '/create.html',
                isabled: true
              },
              {
                name: "维修申请",
                children: [],
                url: '/fixapply.html',
                isabled: true
              },
              {
                name: "维修管理",
                children: [],
                url: '/fixm.html',
                isabled: true
              },
              {
                name: "运维管理",
                children: [],
                url: '/opex.html',
                isabled: true
              }
            ],
            isabled: true
          },
          {
            name: "巡检",
            children: [{
              name: "设备巡检",
              children: [],
              url: '/inseq.html',
              isabled: true
            }, {
              name: "巡检日志",
              children: [],
              url: '/journal.html',
              isabled: true
            }, {
              name: "信号机",
              children: [],
              url: '/insxh.html',
              isabled: true
            }, {
              name: "诱导屏",
              children: [],
              url: '/inseq.html',
              isabled: true
            }, {
              name: "地磁线圈微波",
              children: [],
              url: '/insdc.html',
              isabled: true
            }, {
              name: "电警",
              children: [],
              url: '/insdj.html',
              isabled: true
            }, {
              name: "卡口",
              children: [],
              url: '/inskk.html',
              isabled: true
            }, {
              name: "视频list",
              children: [],
              url: '/insvdls.html',
              isabled: true
            }, {
              name: "视频九宫",
              children: [],
              url: '/insvdmd.html',
              isabled: true
            }],
            isabled: true
          }
        ],
        token: ''
      };
    },
    methods: {
      isabled(isabled) {
        return !isabled;
      },
      getIdx(idx, cIdx) {
        return cIdx ? idx + "-" + cIdx : idx + "";
      },
      handleOpen(key, keyPath) {
        sessionStorage.setItem("keyPath", key);
      },
      gotoUrl(item) {
        window.location.href = this.$config.ProjectName + item.url + '?token=' + this.token;
      }
    },
    mounted() {
      this.keyPath = sessionStorage.getItem("keyPath");
      if (!this.keyPath) this.keyPath = "1";
      this.token = Common.getQueryString("token");
    }
  };

</script>
<style scoped>
  .el-menu-vertical-demo {
    min-width: 150px !important;
    font-size: 12px;
    display: none;
    border-right: none;
  }

  .disabled {
    color: #868d98;
  }

  .icon-menu-tools {
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-block;
    left: -6px;
    background: url("../../assets/images/icon-menu-tools.png") no-repeat;
  }

</style>
