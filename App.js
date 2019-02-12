/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen'
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import TabBarItem from './src/Component/TabBarItem'; //底部公共组建
import Course from './src/Course/Course'; //课程
import Vip from './src/Vip/Vip'; // 会员
import Find from './src/Find/Find'; // 发现
import My from './src/My/My'; //我的
import Search from './src/Course/Search/Search'; //搜索
import VideoList from "./src/Course/BigData/VideoList"; // 视频
import Login from './src/Component/Login'; // 登录
import PaymentOrder from './src/Course/BigData/PaymentOrder'; // 支付订单
import Registe from "./src/Component/Registe"; // 注册
import LoginPwd from './src/Component/LoginPwd'; // 忘记密码
import BigData from './src/Course/BigData/BigData'; //  大数据组建
import BookAcademy from './src/Course/BookAcademy/BookAcademy' //  书院
import RecommendVideo from './src/Course/RecommendVideo/RecommendVideo'; // 今日推荐video
import BookDetails from './src/Find/Component/BookDetails/BookDetails'; //书院课堂详情
import Questions from './src/Find/Component/Questions/Questions'; //提问
import OnLineDetails from './src/Find/Component/OnLineDetails/OnLineDetails'; // 在线问答详情
import PublishedAnswer from "./src/Find/Component/PublishedAnswer/PublishedAnswer"; // 发表回答
import UserDetails from './src/My/Component/UserDetails'; //个人信息
import Withdrawal from './src/My/Withdrawal/Withdrawal'; //  我要提现
import AlipayWithdrawal from './src/My/Withdrawal/AlipayWithdrawal'; // 支付宝提现
import BankCardWithdrawal from './src/My/Withdrawal/BankCardWithdrawal'; //银行卡提现
import SelectBank from './src/My/Withdrawal/SelectBank'; //选择银行卡
import MyOrder from './src/My/Component/MyOrder/MyOrder';//我的订单
import MyBalance from './src/My/Component/MyBalance/MyBalance'; //我的余额
import MyBalanceAmount from './src/My/Component/MyBalance/MyBalanceAmount'; //我的充值界面
import BalanceDetails from './src/My/Component/MyBalance/BalanceDetails'; //我的余额明细
import UserCollect from "./src/My/Component/UserCollect/UserCollect";//我的收藏
import WithdrawalRecord from "./src/My/Component/WithdrawalRecord";//提现记录
import WithdrawalRecordDetails from "./src/My/Component/WithdrawalRecordDetails";//提现记录详情
import Setting from "./src/My/Component/Setting";// 设置
import ChangePwd from "./src/My/Component/ChangePwd/ChangePwd"; // 修改密码
import ReplacePhone from "./src/My/Component/ReplacePhone/ReplacePhone"; // 更换手机号
import UserQuiz from "./src/My/Component/UserQuiz";// 我的提问
import UserQuizDetails from "./src/My/Component/UserQuizDetails/UserQuizDetails";// 我的提问详情
import HelpFeedback from "./src/My/Component/HelpFeedback/HelpFeedback"; // 帮助与反馈
import HelpFeedbackDetails from "./src/My/Component/HelpFeedback/HelpFeedbackDetails";//帮助与反馈详情
import Feedback from "./src/My/Component/HelpFeedback/Feedback";  // 意见反馈
import MyVip from "./src/My/Component/MyVip";  // 我的会员
import CustomerService from './src/Component/CustomerService'; //在线客服
class App extends Component<{}> {
    componentDidMount() {
        SplashScreen.hide()
    }
    render() {
        return (
            <Navigator/>
        );
    }
}
// 底部tabBar
const TabBar = createBottomTabNavigator({
    CourseItem: {
        screen: Course,
        navigationOptions: () => ({
            tabBarLabel: '课程',
            tabBarIcon:({focused, tintColor}) => (
                <TabBarItem
                    normalImage={require('./src/Image/TabBar/Course.png')}
                    selectedImage={require('./src/Image/TabBar/Course1.png')}
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        })
    },
    VipItem: {
        screen: Vip,
        navigationOptions: () => ({
            tabBarLabel: '会员',
            tabBarIcon:({focused, tintColor}) => (
                <TabBarItem
                    normalImage={require('./src/Image/TabBar/Vip.png')}
                    selectedImage={require('./src/Image/TabBar/Vip1.png')}
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        })
    },
    FindItem: {
        screen: Find,
        navigationOptions: () => ({
            tabBarLabel: '发现',
            tabBarIcon:({focused, tintColor}) => (
                <TabBarItem
                    normalImage={require('./src/Image/TabBar/Find.png')}
                    selectedImage={require('./src/Image/TabBar/Find1.png')}
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        })
    },
    MyItem: {
        screen: My,
        navigationOptions: () => ({
            tabBarLabel: '我的',
            tabBarIcon:({focused, tintColor}) => (
                <TabBarItem
                    normalImage={require('./src/Image/TabBar/My.png')}
                    selectedImage={require('./src/Image/TabBar/My1.png')}
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        })
    }
},
    {
    backBehavior: 'CourseItem',
    tabBarPosition: 'bottom',
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: '#4089D5',
        inactiveTintColor: '#979797',
        style: {backgroundColor: '#fff'}
    }
})

const Navigator = createStackNavigator(
    {
        // 底部导航
        TabBar:{
            screen: TabBar,
            navigationOptions: {
                header: null,
            }
         },
        // 搜索
        Search:{
            screen: Search,
            navigationOptions: {
                header: null,
            }
        },
        // 视频
        VideoList:{
            screen: VideoList,
            navigationOptions: {
                header: null,
            }
        },
        // 登录
        Login:{
            screen: Login,
            navigationOptions: {
                header: null,
            }
        },
        // 支付订单
        PaymentOrder: {
            screen: PaymentOrder,
            navigationOptions: {
                header: null,
            }
        },
        // 注册
        Registe: {
            screen: Registe,
            navigationOptions: {
                header: null,
            }
        },
        // 忘记密码
        LoginPwd: {
            screen: LoginPwd,
            navigationOptions: {
                header: null,
            }
        },
        // 大数据
        BigData: {
            screen: BigData,
            navigationOptions: {
                header: null,
            }
        },
        //  书院
        BookAcademy: {
            screen: BookAcademy,
            navigationOptions: {
                header: null,
            }
        },
        // 今日推荐video
        RecommendVideo: {
            screen: RecommendVideo,
            navigationOptions: {
                header: null,
            }
        },
        // 书院课堂详情
        BookDetails: {
            screen: BookDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 提问
        Questions: {
            screen: Questions,
            navigationOptions: {
                header: null,
            }
        },
        // 在线问答详情
        OnLineDetails: {
            screen: OnLineDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 发表回答
        PublishedAnswer: {
            screen: PublishedAnswer,
                navigationOptions: {
                header: null,
            }
        },
        // 我要提现
        Withdrawal : {
            screen: Withdrawal,
            navigationOptions: {
                header: null,
            }
        },
        // 支付宝提现
        AlipayWithdrawal: {
            screen: AlipayWithdrawal,
            navigationOptions: {
                header: null,
            }
        },
        // 银行卡提现
        BankCardWithdrawal: {
            screen: BankCardWithdrawal,
            navigationOptions: {
                header: null,
            }
        },
        //  选择银行卡
        SelectBank: {
            screen: SelectBank,
            navigationOptions: {
                header: null,
            }
        },
        // 个人信息
        UserDetails: {
            screen: UserDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 我的订单
        MyOrder: {
            screen: MyOrder,
            navigationOptions: {
                header: null,
            }
        },
        // 我的收藏
        UserCollect: {
            screen: UserCollect,
            navigationOptions: {
                header: null,
            }
        },
        // 提现记录
        WithdrawalRecord: {
            screen: WithdrawalRecord,
            navigationOptions: {
                header: null,
            }
        },
        // 设置
        Setting: {
            screen: Setting,
            navigationOptions: {
                header: null,
            }
        },
        // 修改密码
        ChangePwd: {
            screen: ChangePwd,
            navigationOptions: {
                header: null,
            }
        },
        // 更换手机号码
        ReplacePhone: {
            screen: ReplacePhone,
            navigationOptions: {
                header: null,
            }
        },
        // 我的提问
        UserQuiz: {
            screen: UserQuiz,
            navigationOptions: {
                header: null,
            }
        },
        // 帮助与反馈
        HelpFeedback: {
            screen: HelpFeedback,
            navigationOptions: {
                header: null,
            }
        },
        // 我的提问详情
        UserQuizDetails: {
            screen: UserQuizDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 帮助与反馈详情
        HelpFeedbackDetails: {
            screen: HelpFeedbackDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 意见反馈
        Feedback : {
            screen: Feedback,
            navigationOptions: {
                header: null,
            }
        },
        // 提现记录详情
        WithdrawalRecordDetails : {
            screen: WithdrawalRecordDetails,
            navigationOptions: {
                header: null,
            }
        },
        // 在线客服
        CustomerService : {
            screen: CustomerService,
            navigationOptions: {
                header: null,
            }
        },
        //  我的会员
        MyVip: {
            screen: MyVip,
            navigationOptions: {
                header: null,
            }
        },
        //我的余额
        MyBalance: {
            screen: MyBalance,
            navigationOptions: {
                header: null,
            }
        },
        //我的余额明细
        BalanceDetails: {
            screen: BalanceDetails,
            navigationOptions: {
                header: null
            }
        },
        //我的充值界面
        MyBalanceAmount: {
            screen: MyBalanceAmount,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        navigationOptions: {
            headerBackTitle: null,
            headerTintColor: '#333333',
            showIcon: true,
        },
    }
)

export default App;
