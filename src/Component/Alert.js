import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Utils from '../Store/Utils';
let {width, height} = Dimensions.get("window");

export default class HRAlertView extends Component {

    //定义静态的属性,可以通过this.props.alertTitle传值
    static propTypes = {
        alertTitle: PropTypes.string,
        alertContent: PropTypes.string,
        rightName: PropTypes.string,
        leftName: PropTypes.string,
        centerName: PropTypes.string,
    }

    constructor(props) {
        super(props);

        this.state = ({
            isShow: false,
            conformName:'确定',
            cancleName:'取消',
        })
    }

    render() {
        if (!this.state.isShow) {
            return null;
        } else {
            return (
                <Modal
                    visible={this.state.isShow}
                    transparent={true}
                    //显示是的动画默认none
                    //从下面向上滑动slide
                    //慢慢显示fade
                    // animationType={'fade'}
                    onRequestClose={() => {

                    }}
                >
                    <View style={styles.containerStyle}>
                        {
                            this.renderMongoliaView()
                        }
                        {
                            this.renderAlertView()
                        }
                    </View>
                </Modal>
            )
        }
        ;
    }

    //蒙层背景
    renderMongoliaView() {
        return (
            <TouchableOpacity style={styles.bgContainViewStyle}
                              onPress={() => this.hideAlertView()}>
                <View/>
            </TouchableOpacity>
        );
    }

    //绘制Alert视图
    renderAlertView() {
        return (
            <View style={styles.alertViewStyle}>
                <View style={styles.titleContainerStyle}>
                    <Text style={styles.titleStyle}>{this.props.alertTitle}</Text></View>
                <View style={styles.contentContainerStyle}>
                    <Text style={styles.contentStyle}>{this.props.alertContent}</Text></View>
                <View style={styles.horizontalLineStyle}/>

                <View style={styles.btnContainerStyle}>
                    { this.props.leftName ?
                        <TouchableOpacity onPress={() => {
                            this.dissmissDialog(0);
                            this.dissmissDialog();
                            this.props.leftClick()
                        }} style={styles.btnStyle}>
                            <Text style={{fontSize: Utils.setSpText(16), color: '#157efb', fontWeight: '700'}}>{this.props.leftName}</Text>
                        </TouchableOpacity>
                        : null
                    }


                    <View style={styles.verticalLineStyle}/>
                    {
                        this.props.centerName ?
                            <TouchableOpacity onPress={() => {
                                this.dissmissDialog(0);
                                this.dissmissDialog();
                                this.props.centerClick()
                            }} style={styles.btnStyle}>
                                <Text style={{fontSize: Utils.setSpText(16), color: '#157efb', fontWeight: '700'}}>{this.props.centerName}</Text>
                            </TouchableOpacity>
                            : null
                    }
                    {
                        this.props.centerName ?
                            <View style={styles.verticalLineStyle}/>
                            : null
                    }

                    <TouchableOpacity onPress={() => {
                        this.dissmissDialog(0);
                        this.dissmissDialog();
                        this.props.rightClick()
                    }} style={styles.btnStyle}>
                        <Text style={{fontSize: Utils.setSpText(16), color: '#157efb'}}>{this.props.rightName}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    hideAlertView() {
        this.setState({
            isShow: false,
        });
    }

    //显示
    showDialog() {
        this.setState({
            isShow: true,
        })
    }

    //消失弹窗，最好delay0.3秒
    dissmissDialog = (delay) => {
        let duration = delay;
        this.timer = setTimeout(() => {
            this.setState({
                isShow: false,
            });
            this.timer && clearTimeout(this.timer);
        }, duration * 1000);
    }

}

const styles = StyleSheet.create({
    bgContainViewStyle: {
        height: height,
        width: width,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0, 0.3)',
    },
    containerStyle: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0, 0.3)',
        position: 'absolute',
        justifyContent: 'center',
    },
    alertViewStyle: {
        backgroundColor: 'white',
        borderRadius: 10,
        // height: 130,
        marginLeft: 50,
        marginRight: 50,
    },
    titleContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        height: 30
    },
    titleStyle: {
        fontSize: Utils.setSpText(18),
        fontWeight: '900'
    },
    contentContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentStyle: {
        justifyContent: 'center',
        paddingTop:10,
        paddingBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        fontSize: Utils.setSpText(15),
    },
    horizontalLineStyle: {
        height: 0.5,
        backgroundColor: '#eee'
    },
    btnContainerStyle: {
        flexDirection: 'row',
        width: width - 100,
        height: 45
    },
    verticalLineStyle: {
        height: 47,
        backgroundColor: '#eee',
    },
    btnStyle: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
