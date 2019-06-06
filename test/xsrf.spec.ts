/*
 * @Author: Hale
 * @Description: test xsrf
 * @Date: 2019-06-03
 * @LastEditTime: 2019-06-03
 */

import axios from '../src'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
      axios.defaults.xsrfCookieName + '=;expires=' + new Date(Date.now() - 86400000).toISOString()
  })

  test('should not set xsrf header if cookie is null', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header if cookie is set', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('123456')
    })
  })

  test('should not set xsrf header for cross origin', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('http://example.com/')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header for cross origin when using withCredentials', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=123456'

    axios('http://example.com/', {
      withCredentials: true
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('123456')
    })
  })
})