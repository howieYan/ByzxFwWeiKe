import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    SwRefreshScrollView,
    SwRefreshListView,
    RefreshStatus,
    LoadMoreStatus
} from 'react-native-swRefresh'
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
export default class Book extends Component{
    _page=1;
    _dataSourceList = new ListView.DataSource({rowHasChanged:(row1,row2)=>row1 !== row2});
    constructor(props) {
        super(props);
        this.state = {
            dataSource:this._dataSourceList.cloneWithRows([
                {art_avatar: "https://bywk360.cn/uploads/avatar/352799270690845397.png", art_username: '北邮在线', art_created: "1538381386", art_thumb: "https://bywk.qcdqnet.com/uploads/image/201810/2772753c567fc65fd1cd036932deef7d.jpg", art_title: "PHP基础知识归纳6"},
                {art_avatar: "https://bywk360.cn/uploads/avatar/352799270690845397.png", art_username: '北邮在线', art_created: "1538381386", art_thumb: "https://bywk.qcdqnet.com/uploads/image/201810/2772753c567fc65fd1cd036932deef7d.jpg", art_title: "PHP基础知识归纳6"},
                {art_avatar: "https://bywk360.cn/uploads/avatar/352799270690845397.png", art_username: '北邮在线', art_created: "1538381386", art_thumb: "https://bywk.qcdqnet.com/uploads/image/201810/2772753c567fc65fd1cd036932deef7d.jpg", art_title: "PHP基础知识归纳6"},
            ]),
            size: 5,
            list: [],
            total: null,
            isBottomMode: false,
        };
    }
    componentDidMount() {
        Loading.show('努力加载中...')
        let timer = setTimeout(()=>{
            clearTimeout(timer);
            if (this.refs.listView) {
                this.refs.listView.beginRefresh()
            }
        },200)
    }
    async LoadData () {
        try {
            let formData = new FormData();
            formData.append('page', this._page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/getArticle', formData);
            console.log(data)
            if (Number(data.code) === 0) {
                this.setState({
                    dataSource:this._dataSourceList.cloneWithRows(data.result.list),
                    list: data.result.list,
                    total: data.result.total,
                })
                if (Number(data.result.total) >= 3) {
                    this.setState({
                        isBottomMode: true,
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
        return(
            <View style={[styles.content]}>
                {this._renderListView()}
            </View>
        )

    }

    _renderListView(){
        return(
            <SwRefreshListView
                dataSource={this.state.dataSource}
                ref="listView"
                renderRow={this._renderRow.bind(this)}
                onRefresh={this._onListRefersh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                isShowLoadMore={this.state.isBottomMode}
            />
        )

    }
    _renderRow(rowData) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.onBookButton.bind(this, rowData, rowData.UserImg)}>
                <View style={styles.BookMain}>
                    <View style={styles.BookMainHeader}>
                        <Image style={styles.BookMainHeaderUserIcon} source={{ uri: rowData.art_avatar}}/>
                        <View style={styles.BookMainHeaderUserName}>
                            <Text style={styles.BookMainHeaderUserNameText}>{rowData.art_username}</Text>
                        </View>
                        <Text style={styles.BookMainHeaderTime}>{this.getTime(rowData.art_created)}小时前</Text>
                    </View>
                    <Image style={styles.BookMainImg} source={{ uri: rowData.art_thumb}}/>
                    <Text style={styles.BookMainTitle}>{rowData.art_title}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    //计算时间
    getTime (record) {
        let time = new Date();
        let data = time.getTime();
        data = JSON.stringify(data).substring(0, 10);
        data = data - record;
        data = Utils.formatTs (data, 'HH');
        let timeData = data.substring(0, 1);
        if (Number(timeData) === 0) {
            data = data.replace('0', '');
        }
        return data;
    }
    _onListRefersh(end){
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            this._page = 1;
            this.LoadData();
            if (this.refs.listView) {
                this.refs.listView.resetStatus()
            }
            end()//刷新成功后需要调用end结束刷新
        },1000)
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
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/getArticle', formData);
            if (Number(data.code) === 0) {
                if (this.state.total > 3) {
                    data.result.list.forEach((v, i) => {
                        this.state.list.push(v);
                    });
                    this.setState({
                        dataSource:this._dataSourceList.cloneWithRows(this.state.list),
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
    onBookButton (record) {
        this.props.navigation.navigate('BookDetails', {name: record.art_title, artId: record.art_id});
    }

}
const styles=StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    BookMain: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    BookMainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    BookMainHeaderUserIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    BookMainHeaderUserName: {
        flex: 1,
    },
    BookMainHeaderUserNameText: {
        paddingLeft: 10,
        fontSize: Utils.setSpText(16),
        fontWeight: 'bold',
        color: '#252525',
    },
    BookMainHeaderTime: {
        fontSize: Utils.setSpText(12),
        color: '#A5A5A5',
    },
    BookMainImg: {
        marginTop: 10,
        borderRadius: 5,
        width: Utils.size.width - 20,
        height: 200,
    },
    BookMainTitle: {
        fontSize: Utils.setSpText(14),
        color: '#393939',
        paddingTop: 10,
        paddingBottom: 10,
    }

})
