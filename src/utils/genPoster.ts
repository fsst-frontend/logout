import { ref } from 'vue'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

export function usePoster() {
  const posterImg = ref('')

  /**
   * 生成海报
   * @description 目标元素，附加内容不要是用v-if，使用:style="{ display: 'none' }
   * @param {HTMLElement} refEl - 目标元素
   * @param {string} url - 二维码链接
   * @param {HTMLElement} extraEl - 附加内容 （可以为空）overflow: hidden
   * @param {boolean} noQRCode - 是否不要二维码，默认false（要二维码）
   * @returns {Promise<string>} - 海报图片的 DataURL
   */
  async function genPoster(refEl: HTMLElement, url: string, extraEl?: HTMLElement, noQRCode = false): Promise<string> {
    if (!refEl) {
      console.warn('元素为空，无法生成海报')
      throw new Error('元素为空，无法生成海报')
    }

    const wrapper = document.createElement('div')
    Object.assign(wrapper.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      zIndex: '-1',
      backgroundColor: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
    })

    const clone = refEl.cloneNode(true) as HTMLElement
    clone.style.display = 'block'
    wrapper.appendChild(clone)

    const footer = document.createElement('div')
    Object.assign(footer.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
    })

    const extraElOuter = document.createElement('div')
    Object.assign(extraElOuter.style, {
      padding: '16px',
      overflow: 'hidden',
    })

    if (extraEl) {
      const extraElClone = extraEl.cloneNode(true) as HTMLElement
      extraElClone.style.display = 'block'
      extraElOuter.appendChild(extraElClone)
    }
    else {
      extraElOuter.innerHTML = `<div style="margin-bottom: 4px">未来投资</div>
        <div style="font-size: 12px; color: #8b8b8b">扫码加入，了解更多!</div>`
    }

    if (!noQRCode) {
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, url, { width: 100 })
      footer.appendChild(extraElOuter)
      footer.appendChild(qrCanvas)
    }

    wrapper.appendChild(footer)
    document.body.appendChild(wrapper)

    const canvas = await html2canvas(wrapper, {
      useCORS: true,
      backgroundColor: 'transparent',
      scale: window.devicePixelRatio || 2,
    })

    const dataURL = canvas.toDataURL('image/png')
    document.body.removeChild(wrapper)
    posterImg.value = dataURL

    return dataURL
  }

  return {
    posterImg,
    genPoster,
  }
}
