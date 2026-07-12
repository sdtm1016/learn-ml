import { useState } from 'react';

import { AlgorithmModal } from './components/AlgorithmModal';
import { AlgorithmGraphModal } from './components/AlgorithmGraphModal';
import { ComparisonPanel } from './components/ComparisonPanel';
import { ComparisonModal } from './components/ComparisonModal';
import { KeyboardHelpModal } from './components/KeyboardHelpModal';
import { MedicalAlgorithmModal } from './components/MedicalAlgorithmModal';
import { Header } from './components/layout/Header';
import { ProgressPanel } from './components/ProgressPanel';
import { SketchModal } from './components/SketchModal';
import { AlgorithmSection } from './components/sections/AlgorithmSection';
import { BoostingTrilogySection } from './components/sections/BoostingTrilogySection';
import { ConceptSection } from './components/sections/ConceptSection';
import { HeroSection } from './components/sections/HeroSection';
import { RoadmapSection } from './components/sections/RoadmapSection';
import { algorithms, type AlgorithmCategory, type AlgorithmItem } from './data/algorithms';
import { getExcalidrawScene } from './data/excalidrawScenes';
import { useProgress } from './hooks/useProgress';
import { useComparison } from './hooks/useComparison';
import { useTheme } from './hooks/useTheme';
import { useGlobalKeyboard } from './hooks/useGlobalKeyboard';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('all');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmItem>(algorithms[0]);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isMedicalDocOpen, setIsMedicalDocOpen] = useState(false);
  const { progress, toggleComplete, updateLastViewed, isCompleted } = useProgress();

  // 中文注释：初始化主题
  useTheme();

  // 中文注释：全局快捷键支持
  useGlobalKeyboard({
    onShowHelp: () => setIsKeyboardHelpOpen(true),
  });

  const {
    comparisonList,
    isComparisonModalOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    openComparisonModal,
    closeComparisonModal,
    canAddMore,
    canStartComparison,
  } = useComparison();

  // 中文注释：打开算法详情 Modal
  function openAlgorithmModal(algorithm: AlgorithmItem) {
    setSelectedAlgorithm(algorithm);
    setIsSketchOpen(false);
    updateLastViewed(algorithm.name);
    setIsModalOpen(true);
  }

  // 中文注释：通过算法名称打开详情
  function openAlgorithmByName(algorithmName: string, category: AlgorithmCategory = 'all') {
    const nextAlgorithm = algorithms.find(
      (algorithm) => algorithm.name === algorithmName || algorithm.label === algorithmName
    );

    setSelectedCategory(category);

    if (nextAlgorithm) {
      openAlgorithmModal(nextAlgorithm);
      return;
    }

    document.getElementById('algorithms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 中文注释：切换到上一个算法
  function goToPrevAlgorithm() {
    const currentIndex = algorithms.findIndex((a) => a.name === selectedAlgorithm.name);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : algorithms.length - 1;
    setSelectedAlgorithm(algorithms[prevIndex]);
    updateLastViewed(algorithms[prevIndex].name);
  }

  // 中文注释：切换到下一个算法
  function goToNextAlgorithm() {
    const currentIndex = algorithms.findIndex((a) => a.name === selectedAlgorithm.name);
    const nextIndex = currentIndex < algorithms.length - 1 ? currentIndex + 1 : 0;
    setSelectedAlgorithm(algorithms[nextIndex]);
    updateLastViewed(algorithms[nextIndex].name);
  }

  // 中文注释：打开手绘图弹窗
  function openSketch() {
    setIsSketchOpen(true);
  }

  // 中文注释：获取当前算法的手绘图场景
  const sketchScene = getExcalidrawScene(selectedAlgorithm.name);

  return (
    <div className="app-shell" id="top">
      <Header
        onSelectAlgorithm={openAlgorithmModal}
        onOpenMedicalDoc={() => setIsMedicalDocOpen(true)}
      />

      <main>
        <HeroSection
          onOpenAlgorithmByName={openAlgorithmByName}
          onOpenGraph={() => setIsGraphModalOpen(true)}
        />

        <ConceptSection />

        <BoostingTrilogySection />

        <RoadmapSection
          onOpenAlgorithmByName={openAlgorithmByName}
          completedAlgorithms={progress.completedAlgorithms}
        />

        <AlgorithmSection
          selectedCategory={selectedCategory}
          selectedAlgorithm={selectedAlgorithm}
          onCategoryChange={setSelectedCategory}
          onSelectAlgorithm={openAlgorithmModal}
          isCompleted={isCompleted}
          isInComparison={isInComparison}
          canAddToComparison={canAddMore}
          onAddToComparison={addToComparison}
        />

        <section className="section-shell progress-section" aria-labelledby="progress-title">
          <ProgressPanel progress={progress} />
        </section>
      </main>

      {/* 中文注释：浮动对比面板 */}
      <ComparisonPanel
        comparisonList={comparisonList}
        onRemove={removeFromComparison}
        onClear={clearComparison}
        onStartComparison={openComparisonModal}
        canStartComparison={canStartComparison}
      />

      {/* 中文注释：算法详情 Modal */}
      <AlgorithmModal
        isOpen={isModalOpen}
        algorithm={selectedAlgorithm}
        sketchScene={sketchScene}
        isCompleted={isCompleted(selectedAlgorithm.name)}
        onClose={() => setIsModalOpen(false)}
        onToggleComplete={toggleComplete}
        onOpenSketch={openSketch}
        onPrevAlgorithm={goToPrevAlgorithm}
        onNextAlgorithm={goToNextAlgorithm}
      />

      {/* 中文注释：手绘图弹窗 */}

      {sketchScene && (
        <SketchModal
          open={isSketchOpen}
          title={sketchScene.fileName}
          rawScene={sketchScene.raw}
          onClose={() => setIsSketchOpen(false)}
        />
      )}

      {/* 中文注释：算法对比 Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        algorithms={comparisonList}
        onClose={closeComparisonModal}
        onRemove={removeFromComparison}
        isCompleted={isCompleted}
      />

      {/* 中文注释：快捷键帮助 Modal */}
      <KeyboardHelpModal
        isOpen={isKeyboardHelpOpen}
        onClose={() => setIsKeyboardHelpOpen(false)}
      />

      {/* 中文注释：算法关系图 Modal */}
      <AlgorithmGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        onSelectAlgorithm={openAlgorithmModal}
        isCompleted={isCompleted}
      />

      {/* 中文注释：医疗AI核心算法详解 Modal */}
      <MedicalAlgorithmModal
        isOpen={isMedicalDocOpen}
        onClose={() => setIsMedicalDocOpen(false)}
      />
    </div>
  );
}

export default App;
