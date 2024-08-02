import React, {PropsWithChildren, useCallback, useMemo, useState} from 'react'
import {setEnvData, setPage} from '../redux/envReducer'
import {useAppDispatch, useAppSelector} from '../hooks/redux'
import {
  ASK_ENABLED_DEFAULT,
  CUSTOM_MODEL_TOKENS,
  DEFAULT_SERVER_URL_OPENAI,
  GEMINI_TOKENS,
  HEADER_HEIGHT,
  LANGUAGE_DEFAULT,
  LANGUAGES,
  MODEL_DEFAULT,
  MODEL_MAP,
  MODEL_TIP,
  MODELS,
  PAGE_MAIN,
  PROMPT_DEFAULTS,
  PROMPT_TYPES,
  SUMMARIZE_LANGUAGE_DEFAULT,
  TRANSLATE_FETCH_DEFAULT,
  TRANSLATE_FETCH_MAX,
  TRANSLATE_FETCH_MIN,
  TRANSLATE_FETCH_STEP,
  WORDS_RATE,
} from '../const'
import {IoWarning} from 'react-icons/all'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import {useBoolean, useEventTarget} from 'ahooks'
import {useEventChecked} from '@kky002/kky-hooks'

const Section = (props: {
  title: ShowElement
  htmlFor?: string
} & PropsWithChildren) => {
  const {title, htmlFor, children} = props
  return <div className='flex flex-col gap-1'>
    <label className='font-medium desc-lighter text-xs' htmlFor={htmlFor}>{title}</label>
    <div className='flex flex-col gap-1 rounded py-2 px-2 bg-base-200/75'>{children}</div>
  </div>
}

const FormItem = (props: {
  title: ShowElement
  tip?: string
  htmlFor?: string
} & PropsWithChildren) => {
  const {title, tip, htmlFor, children} = props
  return <div className='flex items-center gap-2'>
    <div className={classNames('basis-3/12 flex-center', tip && 'tooltip tooltip-right z-[100] underline underline-offset-2 decoration-dashed')} data-tip={tip}>
      <label className='font-medium desc' htmlFor={htmlFor}>{title}</label>
    </div>
    <div className='basis-9/12 flex items-center'>
      {children}
    </div>
  </div>
}

const Settings = () => {
  const dispatch = useAppDispatch()
  const envData = useAppSelector(state => state.env.envData)
  const {value: autoExpandValue, onChange: setAutoExpandValue} = useEventChecked(envData.autoExpand)
  // const {value: autoScrollValue, onChange: setAutoScrollValue} = useEventChecked(envData.autoScroll)
  const {value: translateEnableValue, onChange: setTranslateEnableValue} = useEventChecked(envData.translateEnable)
  const {value: summarizeEnableValue, onChange: setSummarizeEnableValue} = useEventChecked(envData.summarizeEnable)
  const {value: searchEnabledValue, onChange: setSearchEnabledValue} = useEventChecked(envData.searchEnabled)
  const {value: askEnabledValue, onChange: setAskEnabledValue} = useEventChecked(envData.askEnabled??ASK_ENABLED_DEFAULT)
  const {value: cnSearchEnabledValue, onChange: setCnSearchEnabledValue} = useEventChecked(envData.cnSearchEnabled)
  const {value: summarizeFloatValue, onChange: setSummarizeFloatValue} = useEventChecked(envData.summarizeFloat)
  const [apiKeyValue, { onChange: onChangeApiKeyValue }] = useEventTarget({initialValue: envData.apiKey??''})
  const [serverUrlValue, setServerUrlValue] = useState(envData.serverUrl)
  const [geminiApiKeyValue, { onChange: onChangeGeminiApiKeyValue }] = useEventTarget({initialValue: envData.geminiApiKey??''})
  const [languageValue, { onChange: onChangeLanguageValue }] = useEventTarget({initialValue: envData.language??LANGUAGE_DEFAULT})
  const [modelValue, { onChange: onChangeModelValue }] = useEventTarget({initialValue: envData.model??MODEL_DEFAULT})
  const [customModelValue, { onChange: onChangeCustomModelValue }] = useEventTarget({initialValue: envData.customModel})
  const [customModelTokensValue, setCustomModelTokensValue] = useState(envData.customModelTokens)
  const [summarizeLanguageValue, { onChange: onChangeSummarizeLanguageValue }] = useEventTarget({initialValue: envData.summarizeLanguage??SUMMARIZE_LANGUAGE_DEFAULT})
  const [hideOnDisableAutoTranslateValue, setHideOnDisableAutoTranslateValue] = useState(envData.hideOnDisableAutoTranslate)
  const [themeValue, setThemeValue] = useState(envData.theme)
  const [fontSizeValue, setFontSizeValue] = useState(envData.fontSize)
  const [aiTypeValue, setAiTypeValue] = useState(envData.aiType)
  const [transDisplayValue, setTransDisplayValue] = useState(envData.transDisplay)
  const [wordsValue, setWordsValue] = useState<number | undefined>(envData.words)
  const [fetchAmountValue, setFetchAmountValue] = useState(envData.fetchAmount??TRANSLATE_FETCH_DEFAULT)
  const [moreFold, {toggle: toggleMoreFold}] = useBoolean(true)
  const [promptsFold, {toggle: togglePromptsFold}] = useBoolean(true)
  const fold = useAppSelector(state => state.env.fold)
  const totalHeight = useAppSelector(state => state.env.totalHeight)
  const [promptsValue, setPromptsValue] = useState<{[key: string]: string}>(envData.prompts??{})
  // const wordsList = useMemo(() => {
  //   const list = []
  //   for (let i = WORDS_MIN; i <= WORDS_MAX; i += WORDS_STEP) {
  //     list.push(i)
  //   }
  //   return list
  // }, [])
  const transFetchAmountList = useMemo(() => {
    const list = []
    for (let i = TRANSLATE_FETCH_MIN; i <= TRANSLATE_FETCH_MAX; i += TRANSLATE_FETCH_STEP) {
      list.push(i)
    }
    return list
  }, [])
  const apiKeySetted = useMemo(() => {
    if (aiTypeValue === 'gemini') {
      return !!geminiApiKeyValue
    }
    return !!apiKeyValue
  }, [aiTypeValue, apiKeyValue, geminiApiKeyValue])

  const onChangeHideOnDisableAutoTranslate = useCallback((e: any) => {
    setHideOnDisableAutoTranslateValue(e.target.checked)
  }, [])

  const onSave = useCallback(() => {
    dispatch(setEnvData({
      autoExpand: autoExpandValue,
      aiType: aiTypeValue,
      apiKey: apiKeyValue,
      serverUrl: serverUrlValue,
      model: modelValue,
      customModel: customModelValue,
      customModelTokens: customModelTokensValue,
      geminiApiKey: geminiApiKeyValue,
      translateEnable: translateEnableValue,
      language: languageValue,
      hideOnDisableAutoTranslate: hideOnDisableAutoTranslateValue,
      theme: themeValue,
      transDisplay: transDisplayValue,
      summarizeEnable: summarizeEnableValue,
      summarizeFloat: summarizeFloatValue,
      summarizeLanguage: summarizeLanguageValue,
      words: wordsValue,
      fetchAmount: fetchAmountValue,
      fontSize: fontSizeValue,
      prompts: promptsValue,
      searchEnabled: searchEnabledValue,
      cnSearchEnabled: cnSearchEnabledValue,
      askEnabled: askEnabledValue,
    }))
    dispatch(setPage(PAGE_MAIN))
    toast.success('保存成功')
  }, [dispatch, autoExpandValue, aiTypeValue, apiKeyValue, serverUrlValue, modelValue, customModelValue, customModelTokensValue, geminiApiKeyValue, translateEnableValue, languageValue, hideOnDisableAutoTranslateValue, themeValue, transDisplayValue, summarizeEnableValue, summarizeFloatValue, summarizeLanguageValue, wordsValue, fetchAmountValue, fontSizeValue, promptsValue, searchEnabledValue, cnSearchEnabledValue, askEnabledValue])

  const onCancel = useCallback(() => {
    dispatch(setPage(PAGE_MAIN))
  }, [dispatch])

  const onFetchAmountChange = useCallback((e: any) => {
    setFetchAmountValue(parseInt(e.target.value))
  }, [])

  const onWordsChange = useCallback((e: any) => {
    setWordsValue(parseInt(e.target.value))
  }, [])

  const onSel1 = useCallback(() => {
    setTransDisplayValue('originPrimary')
  }, [])

  const onSel2 = useCallback(() => {
    setTransDisplayValue('targetPrimary')
  }, [])

  const onSel3 = useCallback(() => {
    setTransDisplayValue('target')
  }, [])

  const onSelTheme1 = useCallback(() => {
    setThemeValue('system')
  }, [])

  const onSelTheme2 = useCallback(() => {
    setThemeValue('light')
  }, [])

  const onSelTheme3 = useCallback(() => {
    setThemeValue('dark')
  }, [])

  const onSelFontSize1 = useCallback(() => {
    setFontSizeValue('normal')
  }, [])

  const onSelFontSize2 = useCallback(() => {
    setFontSizeValue('large')
  }, [])

  const onSelOpenai = useCallback(() => {
    setAiTypeValue('openai')
  }, [])

  const onSelGemini = useCallback(() => {
    setAiTypeValue('gemini')
  }, [])

  return <div className='text-sm overflow-y-auto' style={{
    height: fold?undefined:`${totalHeight-HEADER_HEIGHT}px`,
  }}>
    <div className="flex flex-col gap-3 p-2">
      <Section title='通用配置'>
        <FormItem title='自动展开' htmlFor='autoExpand' tip='是否视频有字幕时自动展开字幕列表'>
          <input id='autoExpand' type='checkbox' className='toggle toggle-primary' checked={autoExpandValue}
                 onChange={setAutoExpandValue}/>
        </FormItem>
        <FormItem title='主题'>
          <div className="btn-group">
            <button onClick={onSelTheme1} className={classNames('btn btn-xs no-animation', (!themeValue || themeValue === 'system')?'btn-active':'')}>系统</button>
            <button onClick={onSelTheme2} className={classNames('btn btn-xs no-animation', themeValue === 'light'?'btn-active':'')}>浅色</button>
            <button onClick={onSelTheme3} className={classNames('btn btn-xs no-animation', themeValue === 'dark'?'btn-active':'')}>深色</button>
          </div>
        </FormItem>
        <FormItem title='字体大小'>
          <div className="btn-group">
            <button onClick={onSelFontSize1} className={classNames('btn btn-xs no-animation', (!fontSizeValue || fontSizeValue === 'normal')?'btn-active':'')}>普通</button>
            <button onClick={onSelFontSize2} className={classNames('btn btn-xs no-animation', fontSizeValue === 'large'?'btn-active':'')}>加大</button>
          </div>
        </FormItem>
      </Section>



      <Section title={<div className='flex items-center'>
        搜索配置
      </div>}>
        <FormItem title='启用搜索' htmlFor='searchEnabled' tip='是否启用字幕搜索功能'>
          <input id='searchEnabled' type='checkbox' className='toggle toggle-primary' checked={searchEnabledValue}
                 onChange={setSearchEnabledValue}/>
        </FormItem>
        <FormItem title='拼音搜索' htmlFor='cnSearchEnabled' tip='是否启用中文拼音搜索'>
          <input id='cnSearchEnabled' type='checkbox' className='toggle toggle-primary' checked={cnSearchEnabledValue}
                 onChange={setCnSearchEnabledValue}/>
        </FormItem>
      </Section>



      <div className='flex justify-center gap-5'>
        <button className='btn btn-primary btn-sm' onClick={onSave}>保存</button>
        <button className='btn btn-sm' onClick={onCancel}>取消</button>
      </div>
    </div>
  </div>
}

export default Settings
