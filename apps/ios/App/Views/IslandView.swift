import SwiftUI
import AVFoundation
import ScenicKit

/// The animated low-poly islands (design "Hero islands"): muted, looping 36 s videos, calm and slow.
/// With Reduce Motion on, the poster frame is shown instead.
struct IslandView: View {
    var region: IslandRegion = .tuscany
    /// Fill the frame (hero) or fit inside it (small placements).
    var fill = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Group {
            if reduceMotion, let poster = UIImage(named: "isl-\(region.rawValue).png") ?? UIImage(contentsOfFile: Bundle.main.path(forResource: "isl-\(region.rawValue)", ofType: "png") ?? "") {
                Image(uiImage: poster).resizable().aspectRatio(contentMode: fill ? .fill : .fit)
            } else {
                LoopingVideo(name: "isl-\(region.rawValue)", fill: fill).id(region)
            }
        }
        .accessibilityHidden(true)
    }
}

enum IslandRegion: String, CaseIterable, Identifiable {
    case tuscany, dolomites, moselle, fjord
    var id: String { rawValue }
    var title: String {
        switch self {
        case .tuscany: "Val d'Orcia, Tuscany"
        case .dolomites: "Passo Giau, Dolomites"
        case .moselle: "Moselle valley"
        case .fjord: "Geirangerfjord"
        }
    }
}

private struct LoopingVideo: UIViewRepresentable {
    let name: String
    let fill: Bool

    func makeUIView(context: Context) -> PlayerView {
        let view = PlayerView()
        view.backgroundColor = .clear
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp4") else { return view }
        let player = AVQueuePlayer()
        player.isMuted = true
        player.preventsDisplaySleepDuringVideoPlayback = false
        // Never interrupt the driver's music or navigation audio.
        try? AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
        view.looper = AVPlayerLooper(player: player, templateItem: AVPlayerItem(url: url))
        view.playerLayer.player = player
        view.playerLayer.videoGravity = fill ? .resizeAspectFill : .resizeAspect
        player.play()
        return view
    }

    func updateUIView(_ uiView: PlayerView, context: Context) {}

    static func dismantleUIView(_ uiView: PlayerView, coordinator: ()) {
        uiView.playerLayer.player?.pause()
        uiView.looper = nil
    }

    final class PlayerView: UIView {
        var looper: AVPlayerLooper?
        override class var layerClass: AnyClass { AVPlayerLayer.self }
        var playerLayer: AVPlayerLayer { layer as! AVPlayerLayer }
    }
}

/// While roads are being found: the island floats, instead of a spinner.
struct PlanningOverlay: View {
    var body: some View {
        VStack(spacing: 4) {
            IslandView().frame(width: 160, height: 160).clipShape(RoundedRectangle(cornerRadius: 18))
            ProgressView().tint(Theme.green)
        }
        .padding(18)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 24))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Finding beautiful roads")
    }
}
