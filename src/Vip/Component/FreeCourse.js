import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
import {SwRefreshScrollView} from "react-native-swRefresh";
export default class FreeCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPay: 2,
            page: 1,
            size: 20000,
            data: [],
        };

    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            Loading.show('努力加载中...')
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('isPay', this.state.isPay);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/orderList', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result.list,
                })
            }
            Loading.hidden();
        }
        catch (e) {
            console.log(e);
        }
    }
    _onRefresh(end){
        let _this = this;
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            _this.LoadData();
            end()//刷新成功后需要调用end结束刷新
        },500)
        // this.refs.scrollView.scrollTo({x: 0, y: 0, animated: false})
    }
    render() {
        return (
            <View style={styles.content}>
                <SwRefreshScrollView
                    onRefresh={this._onRefresh.bind(this)}
                    ref="scrollView">
                    <View style={styles.content}>
                        <View style={styles.VideoNav}>
                            {this.renderList()}
                        </View>
                    </View>
                </SwRefreshScrollView>
            </View>
        );
    }
    renderList () {
        let Total = this.state.data.length;
        let List = [];
        if (Total > 0) {
            this.state.data.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.onBookButton.bind(this, v)}>
                        <View style={styles.VideoNavLeft}>
                            <View style={i % 2 === 0 ? styles.VideoNavPadd: styles.VideoNavPaddRight}>
                                <Image source={{uri: v.pg_thumb}} style={styles.VideoNavLeftImg}/>
                                <Text style={styles.VideoNavLeftText} numberOfLines={1}>{v.pg_title}</Text>
                                <View style={styles.VideoNavTextState}>
                                    <Text style={styles.VideoNavLeftMoney}>¥ {v.pg_price}</Text>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.VideoNavLeftTime} numberOfLines={1}>人已学{v.pg_sales}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            });
        } else {
            List.push(
                <View style={{flex: 1, width: Utils.size.width, height: 400,alignItems: 'center',justifyContent: 'center'}} key={Total}>
                    <Text>没有数据</Text>
                </View>
            )
        }
        return List;
    }
    onBookButton (record) {
        this.props.navigation.navigate('VideoList', {name: record.pg_title, pgId: record.pg_id, type: 2})
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    VideoNav: {
        paddingTop: 10,
        width: Utils.size.width,
        height: Utils.size.height,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    VideoNavLeft: {
        width: Utils.size.width / 2,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    VideoNavPadd: {
        paddingLeft: 10,
        paddingRight: 5
    },
    VideoNavPaddRight: {
        paddingLeft: 5,
        paddingRight: 10
    },
    VideoNavLeftImg: {
        width: '100%',
        borderRadius: 3,
        height: 100
    },
    VideoNavLeftText: {
        paddingTop: 10,
        fontSize: Utils.setSpText(16),
        color: '#000',
    },
    VideoNavTextState: {
        paddingTop: 10,
        width: Utils.size.width / 2 - 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    VideoNavLeftMoney: {
        fontSize: Utils.setSpText(14),
        color: '#FF0000',
    },
    VideoNavLeftTime: {
        paddingLeft: 10,
        color: '#a7a7a7',
        width: Utils.size.width / 2 - 50,
        fontSize: Utils.setSpText(12)
    }

});

