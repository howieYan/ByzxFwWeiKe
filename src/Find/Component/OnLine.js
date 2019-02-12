import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
} from 'react-native';
import {SwRefreshListView} from 'react-native-swRefresh'
import Utils from "../../Store/Utils";
import ActionButton from "react-native-action-button";
import {Loading} from "../../Component/Loading";

export default class OnLine extends Component{
    _page=1;
    _dataSource = new ListView.DataSource({rowHasChanged:(row1,row2)=>row1 !== row2});
    constructor(props) {
        super(props);
        this.state = {
            dataSource:this._dataSource.cloneWithRows([
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
                {
                    q_title: '怎么安装Centos操作系统？',
                    u_avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/ibOq88esRFfktEYfzB0iaT3wicibXvLNyjPAPAH2kzkDicmNmh4IicLhEb0n1Rqic4AccibF7frjS0ial1CrXHg4Ev0ecAA/132",
                    u_nickname: "Google",
                    q_answer_number: "0"
                },
            ]),
            size: 15,
            list: [],
            isBottomMode: false,
            total: null,
            isListRefersh: false,
        };
    }
    componentDidMount() {
        Loading.show('努力加载中...');
        let _this = this;
        let timer = setTimeout(()=>{
            clearTimeout(timer);
            this.refs.listView.beginRefresh();
            this.setState({
                isListRefersh: true
            })
        },200)
    }
    async LoadData () {
        try {
            let formData = new FormData();
            formData.append('page', this._page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/question', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    dataSource:this._dataSource.cloneWithRows(data.result.list),
                    list: data.result.list,
                    total: data.result.total,
                })
                if (Number(this.state.total) >= 9) {
                    this.setState({
                        isBottomMode: true
                    })
                }
            }
            Loading.hidden();
        }
        catch (e) {
            console.log(e);
        }
    }
    render(){
        return (
            <View style={[styles.content]}>
                <View style={[styles.content]}>
                    {this._renderListView()}
                </View>
                <ActionButton
                    position={'right'}
                    offsetY={150}
                    buttonColor="#E62324"
                    renderIcon={() => (
                        <View style={styles.actionButtonView}>
                            <Image style={{width: 20, height: 20}} source={require('../../Image/ActionButton.png')}/>
                            <Text style={styles.actionButtonText}>提问</Text>
                        </View>
                    )}
                    onPress={this.OnQuestions.bind(this)}
                />
            </View>
        )
    }
    OnQuestions () {
        let _this = this;
        this.props.navigation.navigate('Questions',
            { name: '提问',
            BackLoad: function () {
                _this._page = 1;
                _this.LoadData();
            }});
    }
    _renderListView(){
        return(
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                total={this.state.total}
                renderRow={this._renderRow.bind(this)}
                onRefresh={this._onListRefersh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                isShowLoadMore={this.state.isBottomMode}
            />
        )

    }
    _renderRow(rowData,sectionID,rowID) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.onOnLineButton.bind(this, rowData, sectionID, rowID)}>
                <View style={styles.OnLineMain}>
                    <View style={styles.OnLineMainTitle}>
                        <Text style={styles.OnLineMainTitleText}>{rowData.q_title}</Text>
                        <View style={styles.OnLineMainTitleUser}>
                            <Image style={styles.OnLineMainTitleUserImg} source={{ uri: rowData.u_avatar}}/>
                            <Text style={styles.OnLineMainTitleUserText}>{rowData.u_nickname}</Text>
                        </View>
                    </View>
                    <View style={styles.OnLineMainButton}>
                        <Text style={styles.OnLineMainButtonNumber}>{rowData.q_answer_number}</Text>
                        <Text style={styles.OnLineMainButtonText}>回答</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }
    _onListRefersh(end){
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            this._page = 1;
            this.LoadData();
            this.refs.listView.resetStatus();
            if (this.state.isListRefersh){
                end()//刷新成功后需要调用end结束刷新
            }
        },1500)
    }
    _onLoadMore(end){
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            this._page++;
            this.UpData();
        },1000)
    }
    async UpData () {
        try {
            let formData = new FormData();
            formData.append('page', this._page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/question', formData);
            if (Number(data.code) === 0) {
                if (this.state.total >= 9) {
                    data.result.list.forEach((v, i) => {
                        this.state.list.push(v);
                    });
                    this.setState({
                        dataSource:this._dataSource.cloneWithRows(this.state.list),
                        isBottomMode: true,
                    })
                    let leng = this.state.list.length;
                    this.refs.listView.endLoadMore(Number(leng) >= Number(this.state.total))
                } else {
                    this.setState({
                        isBottomMode: false,
                    })
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    onOnLineButton (record) {
        let _this = this;
        this.props.navigation.navigate('OnLineDetails',
            {   name: '详情',
                data: JSON.stringify(record),
                BackLoad: function () {
                    _this._page = 1;
                    _this.LoadData();
                }});

    }
}
const styles=StyleSheet.create({
    content: {
        flex: 1,
    },
    OnLineMain: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#E7E7E7',
        borderBottomWidth: 1,
    },
    OnLineMainTitle: {
        flex: 1,
    },
    OnLineMainTitleText: {
        fontSize: Utils.setSpText(16),
        color: '#474747',
    },
    OnLineMainTitleUser: {
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    OnLineMainTitleUserImg: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    OnLineMainTitleUserText: {
        paddingLeft: 10,
        fontSize: Utils.setSpText(12),
        color: '#686868',
    },
    OnLineMainButton: {
        width: 50,
        height: 50,
        borderRadius: 2,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    OnLineMainButtonNumber: {
        fontSize: Utils.setSpText(14),
        color: '#333333',
    },
    OnLineMainButtonText: {
        paddingTop: 5,
        fontSize: Utils.setSpText(13),
        color: '#9A9A9A',
    },
    actionButtonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        paddingTop: 5,
        fontSize: Utils.setSpText(12),
        color: '#fff',
    }

})
