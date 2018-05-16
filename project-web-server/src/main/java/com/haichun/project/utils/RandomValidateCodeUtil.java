package com.haichun.project.utils;

import lombok.extern.slf4j.Slf4j;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Random;

/*
 * 文件名：RandomValidateCodeUtil
 * 版权：Copyright © Fable  Data Technology NanJing Co , Ltd.
 * 描述：生成验证码的工具类
 * 创建人： wanghaichun
 * 创建时间：2016-12-14 09:39 AM
 */
@Slf4j
public class RandomValidateCodeUtil {

	private Random random = new Random();

	private String randString = "0123456789abcdefghijklmnopqrstuvwxyz";//随机生成字符串的取值范围

	private int width = 80;     //图片宽度

	private int height = 26;    //图片高度

	private int StringNum = 4;  //验证码图片中随机产生字符的数量

	private int lineSize = 155;  //干扰线数量

	/**
	 * 获取随机字符,并返回字符的String格式
	 *
	 * @param index (指定位置)
	 * @return
	 */
	public String getRandomChar(int index) {
		//获取指定位置index的字符，并转换成字符串表示形式
		return String.valueOf(randString.charAt(index));
	}

	/**
	 * 获得字体
	 *
	 * @return
	 */
	private Font getFont() {
		return new Font("Fixedsys", Font.CENTER_BASELINE, 18);  //名称、样式、磅值
	}

	/**
	 * 获得颜色
	 *
	 * @param frontColor
	 * @param backColor
	 * @return
	 */
	private Color getRandColor(int frontColor, int backColor) {
		Random random = new Random();
		if(frontColor>255) frontColor=255;
		if(backColor>255) backColor=255;
		int r=frontColor+random.nextInt(backColor-frontColor);
		int g=frontColor+random.nextInt(backColor-frontColor);
		int b=frontColor+random.nextInt(backColor-frontColor);
		return new Color(r,g,b);
	}

	/**
	 * 绘制字符串,返回绘制的字符串
	 *
	 * @param g
	 * @param randomString
	 * @param i
	 * @return
	 */
	private String drawString(Graphics g, String randomString, int i) {
		g.setFont(new Font("Times New Roman",Font.PLAIN,18));   //设置字体
		g.setColor(new Color(20+random.nextInt(110),20+random.nextInt(110),20+random.nextInt(110)));
		String randChar = String.valueOf(getRandomChar(random.nextInt(randString.length())));
		randomString += randChar;   //组装
		g.translate(random.nextInt(3), random.nextInt(3));
		g.drawString(randChar, 13 * i+6, 16);
		return randomString;
	}

	/**
	 * 绘制干扰线
	 *
	 * @param g
	 */
	private void drawLine(Graphics g) {
		//起点(x,y)  偏移量x1、y1
		int x = random.nextInt(width);
		int y = random.nextInt(height);
		int xl = random.nextInt(12);
		int yl = random.nextInt(12);
		g.drawLine(x, y, x + xl, y + yl);
	}

	/**
	 * 生成随机图片
	 *
	 * @param request
	 * @param response
	 * @param key
	 */
	public void getRandomCode(HttpServletRequest request, HttpServletResponse response, String key) {

		// BufferedImage类是具有缓冲区的Image类,Image类是用于描述图像信息的类
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);
		Graphics g = image.getGraphics();// 获得BufferedImage对象的Graphics对象
		g.fillRect(0, 0, width, height);//填充矩形
		g.setFont(new Font("Times New Roman",Font.PLAIN,18));//设置字体
		g.setColor(getRandColor(200,250));//设置颜色
		//绘制干扰线
		for (int i = 0; i <= lineSize; i++) {
			drawLine(g);
		}
		//绘制字符
		String randomString = "";
		for (int i = 1; i <= StringNum; i++) {
			randomString = drawString(g, randomString, i);
		}
		log.info("生成的验证码为：" + randomString);
		//将生成的验证码放入session
		request.getSession().setAttribute(key, randomString);

		g.dispose();//释放绘图资源
		try {
			ByteArrayOutputStream tmp = new ByteArrayOutputStream();
			ImageIO.write(image, "jpg", tmp);//将绘制的图片输出到流
			tmp.close();
			Integer contentLength = tmp.size();//内容长度
			response.setHeader("content-length", contentLength + "");
			response.getOutputStream().write(tmp.toByteArray());//通过response输出图片
		}
		catch (Exception e) {
			log.error(e.getMessage());
		}
		finally {
			try {
				response.getOutputStream().flush();
				response.getOutputStream().close();
			}
			catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}
}
